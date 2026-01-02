"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Star, Plus, Trash2, Save, Download, Upload, AlertTriangle, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface Todo {
  text: string
  completed: boolean
  priority: "high" | "medium" | "low"
}

interface JournalEntry {
  date: string
  timestamp: string
  todos: Todo[]
  mainGoal: string
  accomplishments: string
  goodThings: string
  grateful: string
  kindness: string
  ratings: {
    overall: number
    energy: number
    productivity: number
    mood: number
  }
  lessons: string
  improvements: string
  challenges: string
  emotions: string
  futureImprovements: string
  tomorrowGoals: string
  affirmation: string
}

const initialEntry: JournalEntry = {
  date: new Date().toISOString().split("T")[0],
  timestamp: new Date().toLocaleString(),
  todos: [],
  mainGoal: "",
  accomplishments: "",
  goodThings: "",
  grateful: "",
  kindness: "",
  ratings: { overall: 0, energy: 0, productivity: 0, mood: 0 },
  lessons: "",
  improvements: "",
  challenges: "",
  emotions: "",
  futureImprovements: "",
  tomorrowGoals: "",
  affirmation: "",
}

const StarRating = ({
  rating,
  onRatingChange,
  label,
}: {
  rating: number
  onRatingChange: (rating: number) => void
  label: string
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-300",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function DailyJournal() {
  const [entry, setEntry] = useState<JournalEntry>(initialEntry)
  const [newTodo, setNewTodo] = useState("")
  const [todoPriority, setTodoPriority] = useState<"high" | "medium" | "low">("medium")
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("journalEntries")
    if (saved) {
      setSavedEntries(JSON.parse(saved))
    }

    const savedTheme = localStorage.getItem("journalTheme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
    localStorage.setItem("journalTheme", isDarkMode ? "dark" : "light")
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const addTodo = () => {
    if (newTodo.trim()) {
      setEntry((prev) => ({
        ...prev,
        todos: [...prev.todos, { text: newTodo, completed: false, priority: todoPriority }],
      }))
      setNewTodo("")
    }
  }

  const toggleTodo = (index: number) => {
    setEntry((prev) => ({
      ...prev,
      todos: prev.todos.map((todo, i) => (i === index ? { ...todo, completed: !todo.completed } : todo)),
    }))
  }

  const removeTodo = (index: number) => {
    setEntry((prev) => ({
      ...prev,
      todos: prev.todos.filter((_, i) => i !== index),
    }))
  }

  const updateRating = (type: keyof JournalEntry["ratings"], rating: number) => {
    setEntry((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [type]: rating },
    }))
  }

  const saveEntry = () => {
    const updatedEntry = {
      ...entry,
      timestamp: new Date().toLocaleString(),
    }

    const existingIndex = savedEntries.findIndex((e) => e.date === entry.date)
    let newEntries

    if (existingIndex >= 0) {
      const confirmOverwrite = window.confirm(`An entry for ${entry.date} already exists. Do you want to overwrite it?`)
      if (!confirmOverwrite) return

      newEntries = [...savedEntries]
      newEntries[existingIndex] = updatedEntry
    } else {
      newEntries = [...savedEntries, updatedEntry]
    }

    setSavedEntries(newEntries)
    localStorage.setItem("journalEntries", JSON.stringify(newEntries))
    setEntry(initialEntry)
    alert("Entry saved successfully!")
  }

  const exportData = () => {
    const dataToExport = {
      exportDate: new Date().toISOString(),
      totalEntries: savedEntries.length,
      entries: savedEntries,
    }

    const dataStr = JSON.stringify(dataToExport, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(dataBlob)
    link.download = `journal-entries-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    alert(`Successfully exported ${savedEntries.length} journal entries!`)
  }

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)

        if (!importedData.entries || !Array.isArray(importedData.entries)) {
          throw new Error("Invalid file format")
        }

        const existingDates = new Set(savedEntries.map((entry) => entry.date))
        const newEntries = importedData.entries.filter((entry: JournalEntry) => !existingDates.has(entry.date))

        const mergedEntries = [...savedEntries, ...newEntries].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        )

        setSavedEntries(mergedEntries)
        localStorage.setItem("journalEntries", JSON.stringify(mergedEntries))

        alert(
          `Successfully imported ${newEntries.length} new entries! (${importedData.entries.length - newEntries.length} duplicates skipped)`,
        )
      } catch (error) {
        alert("Error importing file. Please make sure it's a valid journal export file.")
      }
    }

    reader.readAsText(file)
    event.target.value = ""
  }

  const clearAllData = () => {
    localStorage.removeItem("journalEntries")
    setSavedEntries([])
    setEntry(initialEntry)
    setShowClearConfirm(false)
    alert("All journal data has been cleared.")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      case "medium":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30"
      case "low":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30"
    }
  }

  const getProductivityStats = () => {
    const total = entry.todos.length
    const completed = entry.todos.filter((todo) => todo.completed).length
    const highPriority = entry.todos.filter((todo) => todo.priority === "high").length
    const completedHigh = entry.todos.filter((todo) => todo.priority === "high" && todo.completed).length

    return {
      total,
      completed,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      highPriority,
      completedHigh,
      highPriorityRate: highPriority > 0 ? Math.round((completedHigh / highPriority) * 100) : 0,
    }
  }

  const completedTodos = entry.todos.filter((todo) => todo.completed).length
  const stats = getProductivityStats()

  return (
    <div className="min-h-screen p-8 md:p-12 lg:p-16 relative animate-in fade-in duration-700">
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse" />
        <div
          className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "6s" }}
        />
        <div
          className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-400/10 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-20 h-20 bg-pink-400/10 rounded-full blur-xl animate-bounce"
          style={{ animationDelay: "4s", animationDuration: "10s" }}
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 px-6 animate-in slide-in-from-top duration-1000">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-in slide-in-from-left duration-1000">
                Daily Reflection
              </h1>
              <p className="text-lg text-muted-foreground mt-6 animate-in slide-in-from-left duration-1000 delay-300">
                Your journey of growth, gratitude, and mindful living
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4 animate-in slide-in-from-left duration-1000 delay-500">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="glass-card hover:scale-105 transition-all duration-200 bg-transparent animate-in slide-in-from-right duration-1000"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Data Management Card */}
        <div className="glass-card border-l-4 border-l-red-500 animate-in slide-in-from-bottom duration-1000 delay-200 rounded-lg pb-2">
          <CardHeader className="pb-6 pt-2">
            <CardTitle className="flex items-center gap-2 text-red-400">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 px-8">
            <div className="text-center p-8 rounded-lg glass-card hover:scale-105 transition-transform duration-300 pb-2">
              <div className="text-3xl font-bold text-primary mb-4">{savedEntries.length}</div>
              <div className="text-sm text-muted-foreground">Total Journal Entries</div>
              {savedEntries.length > 0 && (
                <div className="text-xs text-muted-foreground mt-3">
                  First entry: {new Date(savedEntries[0]?.date).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <Button
                  onClick={exportData}
                  disabled={savedEntries.length === 0}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white border-0 shadow-lg shadow-green-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed py-4 hover:scale-105"
                >
                    <Upload className="w-4 h-4 mr-2" />                  
                  Export Data
                </Button>
                <p className="text-xs text-muted-foreground text-center px-2">Download your entries as JSON</p>
              </div>

              <div className="space-y-4">
                <label className="w-full">
                  <Button
                    as="div"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer py-4 hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-2" />

                    Import Data
                  </Button>
                  <input type="file" accept=".json" onChange={importData} className="hidden" />
                </label>
                <p className="text-xs text-muted-foreground text-center px-2">Upload previous backup</p>
              </div>

              <div className="space-y-4">
                {!showClearConfirm ? (
                  <Button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={savedEntries.length === 0}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 shadow-lg shadow-red-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed py-4 hover:scale-105"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Data
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-red-400 justify-center">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Are you sure?</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={clearAllData}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 shadow-lg shadow-red-500/25 hover:scale-105 transition-all duration-200"
                        size="sm"
                      >
                        Yes, Clear
                      </Button>
                      <Button
                        onClick={() => setShowClearConfirm(false)}
                        variant="outline"
                        size="sm"
                        className="flex-1 border-border/30 hover:bg-muted/20 hover:scale-105 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <p className="text-xs text-muted-foreground text-center px-2">Permanently delete all entries</p>
              </div>
            </div>

            {savedEntries.length > 0 && (
              <div className="p-8 rounded-lg glass-card border border-border/20 hover:scale-105 transition-transform duration-300 pb-2">
                <h4 className="font-medium text-foreground mb-4">Storage Information</h4>
                <div className="grid grid-cols-2 gap-8 text-sm">
                  <div>
                    <span className="text-muted-foreground">Data Size:</span>
                    <span className="ml-2 font-medium">
                      {(JSON.stringify(savedEntries).length / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="ml-2 font-medium">Browser Local Storage</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-6">
                  💡 Tip: Export your data regularly to create backups and prevent data loss.
                </p>
              </div>
            )}
          </CardContent>
        </div>

        {/* Productivity Card */}
        <div className="glass-primary border-2 border-blue-500/30 shadow-lg shadow-blue-500/10 animate-in slide-in-from-bottom duration-1000 delay-400 py-6 rounded-lg pb-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-400">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "0.5s" }} />
              Daily Productivity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                <div className="text-2xl font-bold text-amber-400">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </div>
              <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                <div className="text-2xl font-bold text-green-400">{stats.completionRate}%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                <div className="text-2xl font-bold text-red-400">
                  {stats.completedHigh}/{stats.highPriority}
                </div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Task Management</h3>
                <Badge variant="outline" className="glass-card">
                  {completedTodos}/{entry.todos.length} completed
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  placeholder="Add a new task..."
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTodo()}
                  className="glass-card flex-1 focus:scale-105 transition-transform duration-200"
                />
                <div className="flex gap-3">
                  <select
                    value={todoPriority}
                    onChange={(e) => setTodoPriority(e.target.value as "high" | "medium" | "low")}
                    className="px-4 py-2 rounded-lg glass-card border-0 bg-card/80 text-foreground min-w-[100px] focus:scale-105 transition-transform duration-200"
                  >
                    <option value="high">🔴 High</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="low">🟢 Low</option>
                  </select>
                  <Button
                    onClick={addTodo}
                    size="icon"
                    className="glass-primary hover:scale-110 hover:rotate-90 transition-all duration-200"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {entry.todos.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground animate-pulse">
                    <div className="text-4xl mb-3">📝</div>
                    <p>No tasks yet. Add your first task above!</p>
                  </div>
                ) : (
                  <>
                    {/* High Priority Tasks */}
                    {entry.todos.filter((todo) => todo.priority === "high").length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          High Priority
                        </h4>
                        {entry.todos
                          .map((todo, index) => ({ todo, index }))
                          .filter(({ todo }) => todo.priority === "high")
                          .map(({ todo, index }) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-4 rounded-lg glass-card border-l-2 border-l-red-500 hover:scale-105 hover:translate-x-2 transition-all duration-300 pb-2"
                            >
                              <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(index)}
                                className="w-4 h-4 rounded border-border/30 accent-red-500 hover:scale-125 transition-transform duration-200"
                              />
                              <span
                                className={cn(
                                  "flex-1 transition-all duration-300",
                                  todo.completed && "line-through text-muted-foreground opacity-60 scale-95",
                                )}
                              >
                                {todo.text}
                              </span>
                              <Badge className={getPriorityColor(todo.priority)}>HIGH</Badge>
                              <Button
                                onClick={() => removeTodo(index)}
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8 text-destructive hover:bg-destructive/20 hover:scale-125 hover:rotate-90 transition-all duration-200"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Medium Priority Tasks */}
                    {entry.todos.filter((todo) => todo.priority === "medium").length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                            style={{ animationDelay: "0.5s" }}
                          />
                          Medium Priority
                        </h4>
                        {entry.todos
                          .map((todo, index) => ({ todo, index }))
                          .filter(({ todo }) => todo.priority === "medium")
                          .map(({ todo, index }) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-4 rounded-lg glass-card border-l-2 border-l-amber-500 hover:scale-105 hover:translate-x-2 transition-all duration-300 pb-2"
                            >
                              <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(index)}
                                className="w-4 h-4 rounded border-border/30 accent-amber-500 hover:scale-125 transition-transform duration-200"
                              />
                              <span
                                className={cn(
                                  "flex-1 transition-all duration-300",
                                  todo.completed && "line-through text-muted-foreground opacity-60 scale-95",
                                )}
                              >
                                {todo.text}
                              </span>
                              <Badge className={getPriorityColor(todo.priority)}>MED</Badge>
                              <Button
                                onClick={() => removeTodo(index)}
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8 text-destructive hover:bg-destructive/20 hover:scale-125 hover:rotate-90 transition-all duration-200"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}

                    {/* Low Priority Tasks */}
                    {entry.todos.filter((todo) => todo.priority === "low").length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
                          <div
                            className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                            style={{ animationDelay: "1s" }}
                          />
                          Low Priority
                        </h4>
                        {entry.todos
                          .map((todo, index) => ({ todo, index }))
                          .filter(({ todo }) => todo.priority === "low")
                          .map(({ todo, index }) => (
                            <div
                              key={index}
                              className="flex items-center gap-4 p-4 rounded-lg glass-card border-l-2 border-l-green-500 hover:scale-105 hover:translate-x-2 transition-all duration-300 pb-2"
                            >
                              <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(index)}
                                className="w-4 h-4 rounded border-border/30 accent-green-500 hover:scale-125 transition-transform duration-200"
                              />
                              <span
                                className={cn(
                                  "flex-1 transition-all duration-300",
                                  todo.completed && "line-through text-muted-foreground opacity-60 scale-95",
                                )}
                              >
                                {todo.text}
                              </span>
                              <Badge className={getPriorityColor(todo.priority)}>LOW</Badge>
                              <Button
                                onClick={() => removeTodo(index)}
                                size="icon"
                                variant="ghost"
                                className="w-8 h-8 text-destructive hover:bg-destructive/20 hover:scale-125 hover:rotate-90 transition-all duration-200"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Main Goal */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2 text-blue-400">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "1.5s" }} />
                  Main Daily Goal
                </label>
                <Input
                  placeholder="What's your primary focus today?"
                  value={entry.mainGoal}
                  onChange={(e) => setEntry((prev) => ({ ...prev, mainGoal: e.target.value }))}
                  className="glass-card focus:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Accomplishments */}
              <div className="space-y-4">
                <label className="text-sm font-medium flex items-center gap-2 text-blue-400">
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" style={{ animationDelay: "2s" }} />
                  Daily Accomplishments
                </label>
                <Textarea
                  placeholder="What did you achieve today? Celebrate your wins, big and small!"
                  value={entry.accomplishments}
                  onChange={(e) => setEntry((prev) => ({ ...prev, accomplishments: e.target.value }))}
                  className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
          </CardContent>
        </div>

        {/* Gratitude & Appreciation Card */}
        <div className="glass-success border-l-4 border-l-green-500 animate-in slide-in-from-bottom duration-1000 delay-600 rounded-lg py-1.5 pb-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              Gratitude & Appreciation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                Good Things That Happened Today
              </label>
              <Textarea
                placeholder="What positive moments, experiences, or surprises brightened your day?"
                value={entry.goodThings}
                onChange={(e) => setEntry((prev) => ({ ...prev, goodThings: e.target.value }))}
                className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-green-400">
                <div
                  className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                What I'm Grateful For
              </label>
              <Textarea
                placeholder="People, experiences, opportunities, or simple pleasures you're thankful for today..."
                value={entry.grateful}
                onChange={(e) => setEntry((prev) => ({ ...prev, grateful: e.target.value }))}
                className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{ animationDelay: "1s" }}></div>
                Acts of Kindness
              </label>
              <Textarea
                placeholder="Kindness you gave or received today. Small gestures count too!"
                value={entry.kindness}
                onChange={(e) => setEntry((prev) => ({ ...prev, kindness: e.target.value }))}
                className="glass-card min-h-[80px] focus:scale-105 transition-transform duration-200"
              />
            </div>
          </CardContent>
        </div>

        {/* Self-Reflection & Growth Card */}
        <div className="glass-warning border-l-4 border-l-amber-500 animate-in slide-in-from-bottom duration-1000 delay-800 py-2.5 rounded-lg pb-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-400">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
              Self-Reflection & Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Interactive Rating System */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-lg glass-card border border-amber-500/20 hover:scale-105 transition-transform duration-300 pb-2">
              <div className="md:col-span-2">
                <h3 className="text-lg font-semibold text-amber-400 mb-6 flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  Daily Ratings
                </h3>
              </div>

              <StarRating
                rating={entry.ratings.overall}
                onRatingChange={(rating) => updateRating("overall", rating)}
                label="Overall Day Satisfaction"
              />

              <StarRating
                rating={entry.ratings.energy}
                onRatingChange={(rating) => updateRating("energy", rating)}
                label="Energy Levels"
              />

              <StarRating
                rating={entry.ratings.productivity}
                onRatingChange={(rating) => updateRating("productivity", rating)}
                label="Productivity Rating"
              />

              <StarRating
                rating={entry.ratings.mood}
                onRatingChange={(rating) => updateRating("mood", rating)}
                label="Mood & Emotional State"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                What I Learned Today
              </label>
              <Textarea
                placeholder="New knowledge, insights, skills, or realizations from today..."
                value={entry.lessons}
                onChange={(e) => setEntry((prev) => ({ ...prev, lessons: e.target.value }))}
                className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                <div
                  className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                What I Improved Today
              </label>
              <Textarea
                placeholder="Personal development, skill enhancement, or progress you made..."
                value={entry.improvements}
                onChange={(e) => setEntry((prev) => ({ ...prev, improvements: e.target.value }))}
                className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "1s" }}></div>
                Challenges I Faced
              </label>
              <Textarea
                placeholder="Obstacles you encountered and how you handled them..."
                value={entry.challenges}
                onChange={(e) => setEntry((prev) => ({ ...prev, challenges: e.target.value }))}
                className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                <div
                  className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"
                  style={{ animationDelay: "1.5s" }}
                ></div>
                How I'm Feeling Right Now
              </label>
              <Textarea
                placeholder="Check in with your emotional state. What emotions are you experiencing?"
                value={entry.emotions}
                onChange={(e) => setEntry((prev) => ({ ...prev, emotions: e.target.value }))}
                className="glass-card min-h-[80px] focus:scale-105 transition-transform duration-200"
              />
            </div>
          </CardContent>
        </div>

        {/* Analytics Card */}
        {savedEntries.length > 0 && (
          <div className="glass-card border-l-4 border-l-indigo-500 animate-in slide-in-from-bottom duration-1000 delay-1000 rounded-lg pb-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-400">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
                Your Journey Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Rating Averages */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {(() => {
                  const allEntries = [...savedEntries, entry].filter(
                    (e) =>
                      e.ratings.overall > 0 || e.ratings.energy > 0 || e.ratings.productivity > 0 || e.ratings.mood > 0,
                  )

                  if (allEntries.length === 0) return null

                  const avgOverall = Number(
                    (allEntries.reduce((sum, e) => sum + e.ratings.overall, 0) / allEntries.length).toFixed(1),
                  )
                  const avgEnergy = Number(
                    (allEntries.reduce((sum, e) => sum + e.ratings.energy, 0) / allEntries.length).toFixed(1),
                  )
                  const avgProductivity = Number(
                    (allEntries.reduce((sum, e) => sum + e.ratings.productivity, 0) / allEntries.length).toFixed(1),
                  )
                  const avgMood = Number(
                    (allEntries.reduce((sum, e) => sum + e.ratings.mood, 0) / allEntries.length).toFixed(1),
                  )

                  return (
                    <>
                      <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                        <div className="text-2xl font-bold text-indigo-400">{avgOverall}</div>
                        <div className="text-sm text-muted-foreground">Avg Overall</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-3 h-3",
                                star <= Math.round(avgOverall)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                        <div className="text-2xl font-bold text-green-400">{avgEnergy}</div>
                        <div className="text-sm text-muted-foreground">Avg Energy</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-3 h-3",
                                star <= Math.round(avgEnergy)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                        <div className="text-2xl font-bold text-blue-400">{avgProductivity}</div>
                        <div className="text-sm text-muted-foreground">Avg Productivity</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-3 h-3",
                                star <= Math.round(avgProductivity)
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="text-center p-6 rounded-lg glass-card hover:scale-105 hover:-translate-y-2 transition-all duration-300 pb-2">
                        <div className="text-2xl font-bold text-purple-400">{avgMood}</div>
                        <div className="text-sm text-muted-foreground">Avg Mood</div>
                        <div className="flex justify-center mt-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={cn(
                                "w-3 h-3",
                                star <= Math.round(avgMood) ? "fill-amber-400 text-amber-400" : "text-muted-foreground",
                              )}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )
                })()}
              </div>

              {/* Recent Trends */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-indigo-400">Recent Trends</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Task Completion Trend */}
                  <div className="p-6 rounded-lg glass-card hover:scale-105 transition-transform duration-300 pb-2">
                    <h4 className="font-medium text-blue-400 mb-4">Task Completion</h4>
                    <div className="space-y-3">
                      {savedEntries.slice(-7).map((savedEntry, index) => {
                        const completionRate =
                          savedEntry.todos.length > 0
                            ? Math.round(
                                (savedEntry.todos.filter((t) => t.completed).length / savedEntry.todos.length) * 100,
                              )
                            : 0
                        return (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                              {new Date(savedEntry.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-2 bg-muted/20 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-400 transition-all duration-500"
                                  style={{ width: `${completionRate}%` }}
                                />
                              </div>
                              <span className="text-blue-400 font-medium w-8">{completionRate}%</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Mood Trend */}
                  <div className="p-6 rounded-lg glass-card hover:scale-105 transition-transform duration-300 pb-2">
                    <h4 className="font-medium text-purple-400 mb-4">Mood Trend</h4>
                    <div className="space-y-3">
                      {savedEntries.slice(-7).map((savedEntry, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {new Date(savedEntry.date).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-3 h-3",
                                  star <= savedEntry.ratings.mood
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground",
                                )}
                              />
                            ))}
                            <span className="text-purple-400 font-medium ml-2">{savedEntry.ratings.mood || 0}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights */}
              <div className="p-6 rounded-lg glass-card border border-indigo-500/20 hover:scale-105 transition-transform duration-300 pb-2">
                <h4 className="font-medium text-indigo-400 mb-4">Personal Insights</h4>
                <div className="space-y-3 text-sm">
                  {(() => {
                    const insights = []
                    const recentEntries = savedEntries.slice(-7)

                    if (recentEntries.length > 0) {
                      const avgMood =
                        recentEntries.reduce((sum, e) => sum + (e.ratings.mood || 0), 0) / recentEntries.length
                      const avgProductivity =
                        recentEntries.reduce((sum, e) => sum + e.ratings.productivity || 0, 0) / recentEntries.length
                      const totalTasks = recentEntries.reduce((sum, e) => sum + e.todos.length, 0)
                      const completedTasks = recentEntries.reduce(
                        (sum, e) => sum + e.todos.filter((t) => t.completed).length,
                        0,
                      )
                      const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

                      if (avgMood >= 4) {
                        insights.push("🌟 You've been in great spirits lately! Keep up the positive energy.")
                      } else if (avgMood <= 2) {
                        insights.push("💙 Consider focusing on self-care and activities that bring you joy.")
                      }

                      if (completionRate >= 80) {
                        insights.push("🎯 Excellent task completion rate! You're staying on top of your goals.")
                      } else if (completionRate <= 50) {
                        insights.push("📝 Try breaking down larger tasks into smaller, manageable steps.")
                      }

                      if (avgProductivity >= 4) {
                        insights.push("⚡ Your productivity has been strong. Great momentum!")
                      }

                      const streakDays = savedEntries.length
                      if (streakDays >= 7) {
                        insights.push(`🔥 Amazing! You've maintained a ${streakDays}-day journaling streak.`)
                      }
                    }

                    if (insights.length === 0) {
                      insights.push(
                        "📊 Keep journaling to unlock personalized insights about your patterns and growth!",
                      )
                    }

                    return insights.map((insight, index) => (
                      <div key={index} className="text-muted-foreground">
                        {insight}
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </CardContent>
          </div>
        )}

        {/* Goals & Tomorrow Card */}
        <div className="glass-accent border-l-4 border-l-purple-500 animate-in slide-in-from-bottom duration-1000 delay-1200 rounded-lg pb-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-400">
              <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
              Goals & Tomorrow
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-purple-400">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                Areas to Improve Tomorrow
              </label>
              <Textarea
                placeholder="What would you like to work on or do better tomorrow?"
                value={entry.futureImprovements}
                onChange={(e) => setEntry((prev) => ({ ...prev, futureImprovements: e.target.value }))}
                className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-purple-400">
                <div
                  className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                Tomorrow's Top Priorities
              </label>
              <Textarea
                placeholder="What are the 3 most important things you want to accomplish tomorrow?"
                value={entry.tomorrowGoals}
                onChange={(e) => setEntry((prev) => ({ ...prev, tomorrowGoals: e.target.value }))}
                className="glass-card min-h-[100px] focus:scale-105 transition-transform duration-200"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium flex items-center gap-2 text-purple-400">
                <div
                  className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
                Daily Affirmation
              </label>
              <Input
                placeholder="A positive statement to carry forward into tomorrow..."
                value={entry.affirmation}
                onChange={(e) => setEntry((prev) => ({ ...prev, affirmation: e.target.value }))}
                className="glass-card focus:scale-105 transition-transform duration-200"
              />
            </div>
          </CardContent>
        </div>

        {/* Save Button */}
        <div className="flex justify-center py-12 animate-in slide-in-from-bottom duration-1000 delay-1400">
          <Button
            onClick={saveEntry}
            className="glass-primary px-12 py-6 text-lg hover:scale-110 transition-all duration-300 shadow-lg"
          >
            <Save className="w-5 h-5 mr-3" />
            Save Today's Entry
          </Button>
        </div>

        {/* Recent Entries */}
        {savedEntries.length > 0 && (
          <div className="glass-card animate-in slide-in-from-bottom duration-1000 delay-1600 rounded-lg pb-2">
            <CardHeader>
              <CardTitle>Recent Entries ({savedEntries.length} total)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {savedEntries
                  .slice(-5)
                  .reverse()
                  .map((savedEntry, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg glass-card border border-border/20 hover:scale-105 transition-transform duration-300 pb-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{savedEntry.date}</span>
                        <span className="text-sm text-muted-foreground">{savedEntry.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{savedEntry.mainGoal || "No main goal set"}</p>
                      <div className="flex gap-3 mt-3">
                        <Badge variant="outline" className="text-xs">
                          {savedEntry.todos.filter((t) => t.completed).length}/{savedEntry.todos.length} tasks
                        </Badge>
                        {savedEntry.todos.filter((t) => t.priority === "high" && t.completed).length > 0 && (
                          <Badge className="text-xs bg-red-500/20 text-red-300">
                            {savedEntry.todos.filter((t) => t.priority === "high" && t.completed).length} high priority
                            ✓
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </div>
        )}
      </div>
    </div>
  )
}
