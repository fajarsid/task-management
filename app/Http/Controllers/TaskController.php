<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;
use App\Models\TaskList;
use Inertia\Inertia;
use Illuminate\Support\Facades\Gate;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::with('list')->whereHas('list', function ($query) {
            $query->where('user_id', auth()->id());
        })->orderBy('created_at', 'desc');

        // Search filter
        if (request()->has('search') && !empty(request('search'))) {
            $search = request('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        // Completion status filter
        if (request()->has('filter') && request('filter') !== 'all') {
            if (request('filter') === 'completed') {
                $query->where('is_completed', true);
            } elseif (request('filter') === 'pending') {
                $query->where('is_completed', false);
            }
        }

        $tasks = $query->paginate(10);
        $lists = TaskList::where('user_id', auth()->id())->get();

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'lists' => $lists,
            'filters' => [
                'search' => request('search'),
                'filter' => request('filter'),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validasi bahwa list_id milik user yang sedang login
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'list_id' => [
                'required',
                'exists:lists,id',
                function ($attribute, $value, $fail) {
                    if (!TaskList::where('id', $value)->where('user_id', auth()->id())->exists()) {
                        $fail('The selected list is invalid.');
                    }
                },
            ],
            'is_completed' => 'sometimes|boolean',
        ]);

        Task::create($validated);
        
        return redirect()->route('tasks.index')->with('success', 'Task created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        // Authorization check - pastikan task milik user
        if ($task->list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        // Validasi bahwa list_id milik user yang sedang login
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date',
            'list_id' => [
                'required',
                'exists:lists,id',
                function ($attribute, $value, $fail) {
                    if (!TaskList::where('id', $value)->where('user_id', auth()->id())->exists()) {
                        $fail('The selected list is invalid.');
                    }
                },
            ],
            'is_completed' => 'sometimes|boolean',
        ]);

        $task->update($validated);

        return redirect()->route('tasks.index')->with('success', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Authorization check - pastikan task milik user
        if ($task->list->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $task->delete();

        return redirect()->route('tasks.index')->with('success', 'Task deleted successfully.');
    }
}