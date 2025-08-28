import { Head, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Search, List, Calendar, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
    id: number;
    title: string;
    description: string;
    due_date: string | null;
    list_id: number;
    is_completed: boolean;
    list: {
        id: number;
        title: string;
    };
}

interface List {
    id: number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string | null;
        filter: string | null;
    };
    flash: {
        success: string | null;
        error: string | null;
    };
}

const Breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TaskIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(
        (filters.filter as 'all' | 'completed' | 'pending') || 'all',
    );
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToastMessage(flash.success);
            setToastType("success");
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType("error");
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const { data, setData, post, put, reset, processing, errors, delete: destroy } = useForm({
        title: '',
        description: '',
        due_date: '',
        list_id: '',
        is_completed: false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Submitting form:', data);

        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    setEditingTask(null);
                    reset();
                },
                onError: (errors) => {
                    console.error('Update errors:', errors);
                }
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
                onError: (errors) => {
                    console.error('Create errors:', errors);
                }
            });
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsOpen(true);
        setData({
            title: task.title,
            description: task.description || '',
            due_date: task.due_date || '',
            list_id: task.list_id.toString(),
            is_completed: task.is_completed,
        });
    };

    const confirmDelete = () => {
        if (deleteTarget) {
            destroy(route("tasks.destroy", deleteTarget.id), {
                onSuccess: () => setDeleteDialogOpen(false),
                preserveScroll: true,
            });
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('tasks.index'), { 
            search: searchTerm, 
            filter: completionFilter 
        }, { 
            preserveState: true, 
            replace: true 
        });
    };

    const handleFilterChange = (newFilter: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(newFilter);
        router.get(route('tasks.index'), { 
            search: searchTerm, 
            filter: newFilter 
        }, { 
            preserveState: true, 
            replace: true 
        });
    };

    const handlePageChange = (page: number) => {
        router.get(route('tasks.index'), { 
            search: searchTerm, 
            filter: completionFilter, 
            page 
        }, { 
            preserveState: true, 
            replace: true 
        });
    };

    return (
        <AppLayout breadcrumbs={Breadcrumbs}>
            <Head title="Tasks" />
            
            {/* Toast Notification */}
            {showToast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${toastType === "success" ? "bg-green-500" : "bg-red-500"} text-white animate-in fade-in slide-in-from-top-5`}>
                    {toastType === "success" ? (
                        <CheckCircle2 className="h-5 w-5" />
                    ) : (
                        <XCircle className="h-5 w-5" />
                    )}
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete <strong>{deleteTarget?.title}</strong>? This action cannot be undone.</p>
                    <DialogFooter className="mt-4 flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tasks</h1>

                    {/* Create/Edit Task Dialog */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Task
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>
                                    {editingTask ? "Edit Task" : "Create a New Task"}
                                </DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        type="text"
                                        id="title"
                                        placeholder="Title"
                                        value={data.title}
                                        onChange={(e) => setData("title", e.target.value)}
                                        required
                                    />
                                    {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Description"
                                        value={data.description}
                                        onChange={(e) => setData("description", e.target.value)}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="list_id">List</Label>
                                    <Select
                                        value={data.list_id}
                                        onValueChange={(value) => setData("list_id", value)}
                                        required
                                    >
                                        <SelectTrigger className="focus:ring-2 focus:ring-primary">
                                            <SelectValue placeholder="Select a list" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {lists.map((list) => (
                                                <SelectItem key={list.id} value={list.id.toString()}>
                                                    {list.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.list_id && <p className="text-sm text-red-500">{errors.list_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>
                                    <Input
                                        type="date"
                                        id="due_date"
                                        value={data.due_date}
                                        onChange={(e) => setData("due_date", e.target.value)}
                                        className="focus:ring-2 focus:ring-primary"
                                    />
                                    {errors.due_date && <p className="text-sm text-red-500">{errors.due_date}</p>}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="is_completed"
                                        checked={data.is_completed}
                                        onCheckedChange={(checked) => setData("is_completed", checked === true)}
                                    />
                                    <Label htmlFor="is_completed" className="text-sm font-medium leading-none">
                                        Completed
                                    </Label>
                                </div>
                                <Button type="submit" disabled={processing} className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg">
                                    {editingTask ? "Update Task" : "Create Task"}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Search and Filter Section */}
                <div className="flex flex-col gap-4 mb-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2"
                            />
                        </div>
                        <Select value={completionFilter} onValueChange={handleFilterChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by completion" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tasks</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                            Search
                        </Button>
                    </form>

                    {/* Tasks Table */}
                    <div className="rounded-md border">
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="border-b">
                                    <tr>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Description</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">List</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Due Date</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                        <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.data.map((task) => (
                                        <tr key={task.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{task.title}</td>
                                            <td className="p-4 align-middle max-w-[200px] truncate">{task.description || 'No Description'}</td>
                                            <td className="p-4 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <List className="h-4 w-4 text-muted-foreground" />
                                                    {task.list.title}
                                                </div>
                                            </td>
                                            <td className="p-4 align-middle">
                                                {task.due_date ? (
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        {new Date(task.due_date).toLocaleDateString()}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">No Due Date</span>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle">
                                                {task.is_completed ? (
                                                    <div className="flex items-center gap-2 text-green-600">
                                                        <CheckCircle className="h-4 w-4" />
                                                        <span>Completed</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-amber-600">
                                                        <XCircle className="h-4 w-4" />
                                                        <span>Pending</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleEdit(task)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => {
                                                            setDeleteTarget(task);
                                                            setDeleteDialogOpen(true);
                                                        }}
                                                        className="text-destructive hover:text-destructive/90"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {tasks.data.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="p-4 text-center text-muted-foreground">
                                                No tasks found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    
                        {/* Pagination */}
                        <div className="flex items-center justify-between p-4">
                            <div className="text-sm text-muted-foreground">
                                Showing {tasks.from} to {tasks.to} of {tasks.total} results
                            </div>
                            <div className="flex items-center space-x-2">
                                <Button 
                                    variant="outline" 
                                    onClick={() => handlePageChange(tasks.current_page - 1)} 
                                    disabled={tasks.current_page === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-1">
                                    {Array.from({ length: tasks.last_page }, (_, i) => i + 1).map((page) => (
                                        <Button
                                            key={page}
                                            variant={page === tasks.current_page ? "default" : "outline"}
                                            onClick={() => handlePageChange(page)}
                                            className="h-8 w-8"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>
                                <Button 
                                    variant="outline" 
                                    onClick={() => handlePageChange(tasks.current_page + 1)} 
                                    disabled={tasks.current_page === tasks.last_page}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}