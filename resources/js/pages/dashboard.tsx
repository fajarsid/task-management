import AppLayout from '@/layouts/app-layout';
import { Head, Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, List, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { type BreadcrumbItem } from "@/types";
import { route } from "ziggy-js";

interface Props {
  stats?: {
    total_lists: number;
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Dashboard({ stats = {
  total_lists: 0,
  total_tasks: 0,
  completed_tasks: 0,
  pending_tasks: 0,
} }: Props) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      
      <div className="flex flex-col gap-6 rounded-xl p-6 bg-gradient-to-br from-background to-muted/30">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-muted-foreground">Welcome back! Here’s your task overview:</p>
          </div>
          <div className="flex gap-2">
            <Link href={route('lists.index')}>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                <List className="mr-2 h-4 w-4" />
                View Lists
              </Button>
            </Link>
            <Link href={route('tasks.index')}>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-sm">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                View Tasks
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Lists */}
          <Card className="relative overflow-hidden bg-white shadow-sm rounded-xl border">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-blue-500/10 to-transparent" />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">Total Lists</CardTitle>
              <div className="rounded-full bg-blue-100 p-2">
                <List className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-blue-600">{stats.total_lists}</div>
              <p className="text-sm text-muted-foreground">Your task lists</p>
            </CardContent>
          </Card>

          {/* Total Tasks */}
          <Card className="relative overflow-hidden bg-white shadow-sm rounded-xl border">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-green-500/10 to-transparent" />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Total Tasks</CardTitle>
              <div className="rounded-full bg-green-100 p-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-green-600">{stats.total_tasks}</div>
              <p className="text-sm text-muted-foreground">All tasks created</p>
            </CardContent>
          </Card>

          {/* Pending Tasks */}
          <Card className="relative overflow-hidden bg-white shadow-sm rounded-xl border">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent" />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-600">Pending Tasks</CardTitle>
              <div className="rounded-full bg-orange-100 p-2">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-orange-600">{stats.pending_tasks}</div>
              <p className="text-sm text-muted-foreground">Tasks yet to be completed</p>
            </CardContent>
          </Card>

          {/* Completed Tasks */}
          <Card className="relative overflow-hidden bg-white shadow-sm rounded-xl border">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-purple-500/10 to-transparent" />
            <CardHeader className="relative z-10 flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-600">Completed Tasks</CardTitle>
              <div className="rounded-full bg-purple-100 p-2">
                <AlertCircle className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold text-purple-600">{stats.completed_tasks}</div>
              <p className="text-sm text-muted-foreground">Well done!</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Activities */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card className="shadow-sm rounded-xl border border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Link href={route('lists.index')}>
                <Button variant="outline" className="w-full justify-start hover:bg-primary hover:text-white transition-all">
                  <List className="mr-2 h-4 w-4" />
                  View All Lists
                </Button>
              </Link>
              <Link href={route('tasks.index')}>
                <Button variant="outline" className="w-full justify-start hover:bg-primary hover:text-white transition-all">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  View All Tasks
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="shadow-sm rounded-xl border border-primary/10">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <Plus className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Welcome to Task Manager</p>
                  <p className="text-xs text-muted-foreground">You can manage your tasks efficiently.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">You completed 3 tasks</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-full bg-orange-100 p-2">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">2 tasks pending</p>
                  <p className="text-xs text-muted-foreground">Today, 10:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
