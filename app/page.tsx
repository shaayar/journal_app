"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, Star, Plus, Trash2, Save, Download, Upload, AlertTriangle, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { gsap } from "gsap"

import { AnimatedBackground } from "@/components/animations/AnimatedBackground"
import { MorphingCard } from "@/components/animations/MorphingCard"
import { TextReveal } from "@/components/animations/TextReveal"
import { ParallaxSection } from "@/components/animations/ParallaxSection"
import { AnimatedCounter } from "@/components/animations/AnimatedCounter"

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

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
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
    <motion.div className="space-y-2" variants={itemVariants}>
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className="transition-all duration-200"
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              scale: star <= rating ? 1.1 : 1,
              rotate: star <= rating ? [0, 10, -10, 0] : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Star
              className={cn(
                "w-6 h-6 transition-colors",
                star <= rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-300",
              )}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export default function DailyJournal() {
  const [entry, setEntry] = useState<JournalEntry>(initialEntry)
  const [newTodo, setNewTodo] = useState("")
  const [todoPriority, setTodoPriority] = useState<"high" | "medium" | "low">("medium")
  const [savedEntries, setSavedEntries] = useState<JournalEntry[]>([])
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const headerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: -50,
          scale: 0.8,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "back.out(1.7)",
        },
      )
    }
  }, [])

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
      // Show confirmation for overwriting existing entry
      const confirmOverwrite = window.confirm(`An entry for ${entry.date} already exists. Do you want to overwrite it?`)
      if (!confirmOverwrite) return

      newEntries = [...savedEntries]
      newEntries[existingIndex] = updatedEntry
    } else {
      newEntries = [...savedEntries, updatedEntry]
    }

    setSavedEntries(newEntries)
    localStorage.setItem("journalEntries", JSON.stringify(newEntries))

    // Reset form
    setEntry(initialEntry)

    // Show success message
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

        // Validate the imported data structure
        if (!importedData.entries || !Array.isArray(importedData.entries)) {
          throw new Error("Invalid file format")
        }

        // Merge with existing entries, avoiding duplicates
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
    // Reset the input
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
    <motion.div
      className="min-h-screen p-4 md:p-8 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <AnimatedBackground />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          className="text-center space-y-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <TextReveal
                text="Daily Reflection"
                className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                delay={0.2}
                duration={0.1}
              />
              <motion.p
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Your journey of growth, gratitude, and mindful living
              </motion.p>
              <motion.div
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </motion.div>
            </div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="icon"
                className="glass-card hover:scale-105 transition-transform bg-transparent"
              >
                <AnimatePresence mode="wait">
                  {isDarkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Sun className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Moon className="w-4 h-4" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <ParallaxSection speed={0.2} direction="up">
          <MorphingCard hoverScale={1.02} morphDuration={0.4} className="glass-card border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-400">
                <motion.div
                  className="w-2 h-2 rounded-full bg-red-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="text-center p-4 rounded-lg glass-card"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <AnimatedCounter
                  value={savedEntries.length}
                  duration={1.5}
                  className="text-3xl font-bold text-primary mb-2"
                />
                <div className="text-sm text-muted-foreground">Total Journal Entries</div>
                {savedEntries.length > 0 && (
                  <motion.div
                    className="text-xs text-muted-foreground mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    First entry: {new Date(savedEntries[0]?.date).toLocaleDateString()}
                  </motion.div>
                )}
              </motion.div>

              {/* Data Management Actions */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {/* Export Data */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={exportData}
                      disabled={savedEntries.length === 0}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white border-0 shadow-lg shadow-green-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Data
                    </Button>
                  </motion.div>
                  <p className="text-xs text-muted-foreground text-center">Download your entries as JSON</p>
                </motion.div>

                {/* Import Data */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <label className="w-full">
                    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        as="div"
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 shadow-lg shadow-blue-500/25 transition-all duration-200 cursor-pointer"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Import Data
                      </Button>
                    </motion.div>
                    <input type="file" accept=".json" onChange={importData} className="hidden" />
                  </label>
                  <p className="text-xs text-muted-foreground text-center">Upload previous backup</p>
                </motion.div>

                {/* Clear All Data */}
                <motion.div className="space-y-2" variants={itemVariants}>
                  <AnimatePresence mode="wait">
                    {!showClearConfirm ? (
                      <motion.div
                        key="clear-button"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          onClick={() => setShowClearConfirm(true)}
                          disabled={savedEntries.length === 0}
                          className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 shadow-lg shadow-red-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear All Data
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="confirm-dialog"
                        className="space-y-2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                      >
                        <motion.div
                          className="flex items-center gap-2 text-xs text-red-400"
                          animate={{ x: [0, -2, 2, 0] }}
                          transition={{ duration: 0.5, repeat: 2 }}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Are you sure?</span>
                        </motion.div>
                        <div className="flex gap-1">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={clearAllData}
                              className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white border-0 shadow-lg shadow-red-500/25"
                              size="sm"
                            >
                              Yes, Clear
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => setShowClearConfirm(false)}
                              variant="outline"
                              size="sm"
                              className="flex-1 border-border/30 hover:bg-muted/20"
                            >
                              Cancel
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <p className="text-xs text-muted-foreground text-center">Permanently delete all entries</p>
                </motion.div>
              </motion.div>

              {/* Data Usage Info */}
              {savedEntries.length > 0 && (
                <motion.div
                  className="p-4 rounded-lg glass-card border border-border/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="font-medium text-foreground mb-2">Storage Information</h4>
                  <motion.div
                    className="grid grid-cols-2 gap-4 text-sm"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <motion.div variants={itemVariants}>
                      <span className="text-muted-foreground">Data Size:</span>
                      <span className="ml-2 font-medium">
                        {(JSON.stringify(savedEntries).length / 1024).toFixed(1)} KB
                      </span>
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <span className="text-muted-foreground">Storage:</span>
                      <span className="ml-2 font-medium">Browser Local Storage</span>
                    </motion.div>
                  </motion.div>
                  <motion.p
                    className="text-xs text-muted-foreground mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    💡 Tip: Export your data regularly to create backups and prevent data loss.
                  </motion.p>
                </motion.div>
              )}
            </CardContent>
          </MorphingCard>
        </ParallaxSection>

        <ParallaxSection speed={0.3} direction="up">
          <MorphingCard
            hoverScale={1.02}
            morphDuration={0.4}
            className="glass-primary border-2 border-blue-500/30 shadow-lg shadow-blue-500/10"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-400">
                <motion.div
                  className="w-2 h-2 rounded-full bg-blue-500"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                />
                Daily Productivity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div
                  className="text-center p-4 rounded-lg glass-card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedCounter value={stats.completed} duration={1} className="text-2xl font-bold text-blue-400" />
                  <div className="text-sm text-muted-foreground">Completed</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-lg glass-card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedCounter value={stats.total} duration={1.2} className="text-2xl font-bold text-amber-400" />
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-lg glass-card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <AnimatedCounter
                    value={stats.completionRate}
                    duration={1.4}
                    suffix="%"
                    className="text-2xl font-bold text-green-400"
                  />
                  <div className="text-sm text-muted-foreground">Completion Rate</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 rounded-lg glass-card"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <div className="text-2xl font-bold text-red-400">
                    <AnimatedCounter value={stats.completedHigh} duration={1} />
                    /
                    <AnimatedCounter value={stats.highPriority} duration={1.1} />
                  </div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
                </motion.div>
              </motion.div>

              {/* Todo List */}
              <motion.div className="space-y-4" variants={staggerContainer} initial="hidden" animate="visible">
                <motion.div className="flex items-center justify-between" variants={itemVariants}>
                  <h3 className="font-semibold">Task Management</h3>
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                    <Badge variant="outline" className="glass-card">
                      <AnimatedCounter value={completedTodos} duration={1} />
                      /
                      <AnimatedCounter value={entry.todos.length} duration={1.1} />
                      completed
                    </Badge>
                  </motion.div>
                </motion.div>

                <motion.div className="flex flex-col sm:flex-row gap-2" variants={itemVariants}>
                  <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                    <Input
                      placeholder="Add a new task..."
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTodo()}
                      className="glass-card flex-1"
                    />
                  </motion.div>
                  <div className="flex gap-2">
                    <motion.select
                      value={todoPriority}
                      onChange={(e) => setTodoPriority(e.target.value as "high" | "medium" | "low")}
                      className="px-3 py-2 rounded-lg glass-card border-0 bg-card/80 text-foreground min-w-[100px]"
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <option value="high">🔴 High</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="low">🟢 Low</option>
                    </motion.select>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <Button onClick={addTodo} size="icon" className="glass-primary">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>

                <AnimatePresence>
                  <motion.div className="space-y-2">
                    {entry.todos.length === 0 ? (
                      <motion.div
                        className="text-center py-8 text-muted-foreground"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="text-4xl mb-2"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        >
                          📝
                        </motion.div>
                        <p>No tasks yet. Add your first task above!</p>
                      </motion.div>
                    ) : (
                      <>
                        {/* High Priority Tasks */}
                        {entry.todos.filter((todo) => todo.priority === "high").length > 0 && (
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <h4 className="text-sm font-medium text-red-400 flex items-center gap-2">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-red-500"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                              />
                              High Priority
                            </h4>
                            <AnimatePresence>
                              {entry.todos
                                .map((todo, index) => ({ todo, index }))
                                .filter(({ todo }) => todo.priority === "high")
                                .map(({ todo, index }) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg glass-card border-l-2 border-l-red-500"
                                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    layout
                                  >
                                    <motion.input
                                      type="checkbox"
                                      checked={todo.completed}
                                      onChange={() => toggleTodo(index)}
                                      className="w-4 h-4 rounded border-border/30 accent-red-500"
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                    />
                                    <motion.span
                                      className={cn("flex-1", todo.completed && "line-through text-muted-foreground")}
                                      animate={{
                                        opacity: todo.completed ? 0.6 : 1,
                                        scale: todo.completed ? 0.95 : 1,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {todo.text}
                                    </motion.span>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Badge className={getPriorityColor(todo.priority)}>HIGH</Badge>
                                    </motion.div>
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: 90 }}
                                      whileTap={{ scale: 0.8 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Button
                                        onClick={() => removeTodo(index)}
                                        size="icon"
                                        variant="ghost"
                                        className="w-8 h-8 text-destructive hover:bg-destructive/20"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </motion.div>
                                  </motion.div>
                                ))}
                            </AnimatePresence>
                          </motion.div>
                        )}

                        {/* Medium Priority Tasks */}
                        {entry.todos.filter((todo) => todo.priority === "medium").length > 0 && (
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                          >
                            <h4 className="text-sm font-medium text-amber-400 flex items-center gap-2">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-amber-500"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                              />
                              Medium Priority
                            </h4>
                            <AnimatePresence>
                              {entry.todos
                                .map((todo, index) => ({ todo, index }))
                                .filter(({ todo }) => todo.priority === "medium")
                                .map(({ todo, index }) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg glass-card border-l-2 border-l-amber-500"
                                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    layout
                                  >
                                    <motion.input
                                      type="checkbox"
                                      checked={todo.completed}
                                      onChange={() => toggleTodo(index)}
                                      className="w-4 h-4 rounded border-border/30 accent-amber-500"
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                    />
                                    <motion.span
                                      className={cn("flex-1", todo.completed && "line-through text-muted-foreground")}
                                      animate={{
                                        opacity: todo.completed ? 0.6 : 1,
                                        scale: todo.completed ? 0.95 : 1,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {todo.text}
                                    </motion.span>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Badge className={getPriorityColor(todo.priority)}>MED</Badge>
                                    </motion.div>
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: 90 }}
                                      whileTap={{ scale: 0.8 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Button
                                        onClick={() => removeTodo(index)}
                                        size="icon"
                                        variant="ghost"
                                        className="w-8 h-8 text-destructive hover:bg-destructive/20"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </motion.div>
                                  </motion.div>
                                ))}
                            </AnimatePresence>
                          </motion.div>
                        )}

                        {/* Low Priority Tasks */}
                        {entry.todos.filter((todo) => todo.priority === "low").length > 0 && (
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                          >
                            <h4 className="text-sm font-medium text-green-400 flex items-center gap-2">
                              <motion.div
                                className="w-2 h-2 rounded-full bg-green-500"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                              />
                              Low Priority
                            </h4>
                            <AnimatePresence>
                              {entry.todos
                                .map((todo, index) => ({ todo, index }))
                                .filter(({ todo }) => todo.priority === "low")
                                .map(({ todo, index }) => (
                                  <motion.div
                                    key={index}
                                    className="flex items-center gap-3 p-3 rounded-lg glass-card border-l-2 border-l-green-500"
                                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                                    whileHover={{ scale: 1.02, x: 5 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    layout
                                  >
                                    <motion.input
                                      type="checkbox"
                                      checked={todo.completed}
                                      onChange={() => toggleTodo(index)}
                                      className="w-4 h-4 rounded border-border/30 accent-green-500"
                                      whileHover={{ scale: 1.2 }}
                                      whileTap={{ scale: 0.9 }}
                                    />
                                    <motion.span
                                      className={cn("flex-1", todo.completed && "line-through text-muted-foreground")}
                                      animate={{
                                        opacity: todo.completed ? 0.6 : 1,
                                        scale: todo.completed ? 0.95 : 1,
                                      }}
                                      transition={{ duration: 0.3 }}
                                    >
                                      {todo.text}
                                    </motion.span>
                                    <motion.div
                                      whileHover={{ scale: 1.1 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Badge className={getPriorityColor(todo.priority)}>LOW</Badge>
                                    </motion.div>
                                    <motion.div
                                      whileHover={{ scale: 1.2, rotate: 90 }}
                                      whileTap={{ scale: 0.8 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                      <Button
                                        onClick={() => removeTodo(index)}
                                        size="icon"
                                        variant="ghost"
                                        className="w-8 h-8 text-destructive hover:bg-destructive/20"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </motion.div>
                                  </motion.div>
                                ))}
                            </AnimatePresence>
                          </motion.div>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Main Goal */}
              <motion.div className="space-y-2" variants={itemVariants} initial="hidden" animate="visible">
                <label className="text-sm font-medium flex items-center gap-2 text-blue-400">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-blue-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                  />
                  Main Daily Goal
                </label>
                <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Input
                    placeholder="What's your primary focus today?"
                    value={entry.mainGoal}
                    onChange={(e) => setEntry((prev) => ({ ...prev, mainGoal: e.target.value }))}
                    className="glass-card"
                  />
                </motion.div>
              </motion.div>

              {/* Accomplishments */}
              <motion.div className="space-y-2" variants={itemVariants} initial="hidden" animate="visible">
                <label className="text-sm font-medium flex items-center gap-2 text-blue-400">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-blue-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 2 }}
                  />
                  Daily Accomplishments
                </label>
                <motion.div whileFocus={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                  <Textarea
                    placeholder="What did you achieve today? Celebrate your wins, big and small!"
                    value={entry.accomplishments}
                    onChange={(e) => setEntry((prev) => ({ ...prev, accomplishments: e.target.value }))}
                    className="glass-card min-h-[100px]"
                  />
                </motion.div>
              </motion.div>
            </CardContent>
          </MorphingCard>
        </ParallaxSection>

        <ParallaxSection speed={0.4} direction="up">
          <MorphingCard hoverScale={1.02} morphDuration={0.4} className="glass-success border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-400">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                Gratitude & Appreciation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Good Things Today */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Good Things That Happened Today
                </label>
                <Textarea
                  placeholder="What positive moments, experiences, or surprises brightened your day?"
                  value={entry.goodThings}
                  onChange={(e) => setEntry((prev) => ({ ...prev, goodThings: e.target.value }))}
                  className="glass-card min-h-[100px]"
                />
              </div>

              {/* Gratitude List */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  What I'm Grateful For
                </label>
                <Textarea
                  placeholder="People, experiences, opportunities, or simple pleasures you're thankful for today..."
                  value={entry.grateful}
                  onChange={(e) => setEntry((prev) => ({ ...prev, grateful: e.target.value }))}
                  className="glass-card min-h-[100px]"
                />
              </div>

              {/* Acts of Kindness */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Acts of Kindness
                </label>
                <Textarea
                  placeholder="Kindness you gave or received today. Small gestures count too!"
                  value={entry.kindness}
                  onChange={(e) => setEntry((prev) => ({ ...prev, kindness: e.target.value }))}
                  className="glass-card min-h-[80px]"
                />
              </div>
            </CardContent>
          </MorphingCard>
        </ParallaxSection>

        <ParallaxSection speed={0.5} direction="up">
          <MorphingCard hoverScale={1.02} morphDuration={0.4} className="glass-warning border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-400">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                Self-Reflection & Growth
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Interactive Rating System */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg glass-card border border-amber-500/20">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold text-amber-400 mb-4 flex items-center gap-2">
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

              {/* What I Learned Today */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  What I Learned Today
                </label>
                <Textarea
                  placeholder="New knowledge, insights, skills, or realizations from today..."
                  value={entry.lessons}
                  onChange={(e) => setEntry((prev) => ({ ...prev, lessons: e.target.value }))}
                  className="glass-card min-h-[100px]"
                />
              </div>

              {/* What I Improved Today */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  What I Improved Today
                </label>
                <Textarea
                  placeholder="Personal development, skill enhancement, or progress you made..."
                  value={entry.improvements}
                  onChange={(e) => setEntry((prev) => ({ ...prev, improvements: e.target.value }))}
                  className="glass-card min-h-[100px]"
                />
              </div>

              {/* Challenges Faced */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  Challenges I Faced
                </label>
                <Textarea
                  placeholder="Obstacles you encountered and how you handled them..."
                  value={entry.challenges}
                  onChange={(e) => setEntry((prev) => ({ ...prev, challenges: e.target.value }))}
                  className="glass-card min-h-[100px]"
                />
              </div>

              {/* Current Emotions */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-amber-400">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  How I'm Feeling Right Now
                </label>
                <Textarea
                  placeholder="Check in with your emotional state. What emotions are you experiencing?"
                  value={entry.emotions}
                  onChange={(e) => setEntry((prev) => ({ ...prev, emotions: e.target.value }))}
                  className="glass-card min-h-[80px]"
                />
              </div>
            </CardContent>
          </MorphingCard>
        </ParallaxSection>

        {savedEntries.length > 0 && (
          <ParallaxSection speed={0.6} direction="up">
            <MorphingCard hoverScale={1.02} morphDuration={0.4} className="glass-card border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-400">
                  <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                  Your Journey Analytics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rating Averages */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(() => {
                    const allEntries = [...savedEntries, entry].filter(
                      (e) =>
                        e.ratings.overall > 0 ||
                        e.ratings.energy > 0 ||
                        e.ratings.productivity > 0 ||
                        e.ratings.mood > 0,
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
                        <motion.div
                          className="text-center p-4 rounded-lg glass-card"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <AnimatedCounter
                            value={avgOverall}
                            duration={1.5}
                            className="text-2xl font-bold text-indigo-400"
                          />
                          <div className="text-sm text-muted-foreground">Avg Overall</div>
                          <div className="flex justify-center mt-1">
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
                        </motion.div>

                        <motion.div
                          className="text-center p-4 rounded-lg glass-card"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <AnimatedCounter
                            value={avgEnergy}
                            duration={1.6}
                            className="text-2xl font-bold text-green-400"
                          />
                          <div className="text-sm text-muted-foreground">Avg Energy</div>
                          <div className="flex justify-center mt-1">
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
                        </motion.div>

                        <motion.div
                          className="text-center p-4 rounded-lg glass-card"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <AnimatedCounter
                            value={avgProductivity}
                            duration={1.7}
                            className="text-2xl font-bold text-blue-400"
                          />
                          <div className="text-sm text-muted-foreground">Avg Productivity</div>
                          <div className="flex justify-center mt-1">
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
                        </motion.div>

                        <motion.div
                          className="text-center p-4 rounded-lg glass-card"
                          whileHover={{ scale: 1.05, y: -5 }}
                          transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                          <AnimatedCounter
                            value={avgMood}
                            duration={1.8}
                            className="text-2xl font-bold text-purple-400"
                          />
                          <div className="text-sm text-muted-foreground">Avg Mood</div>
                          <div className="flex justify-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={cn(
                                  "w-3 h-3",
                                  star <= Math.round(avgMood)
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground",
                                )}
                              />
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )
                  })()}
                </div>

                {/* Recent Trends */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-indigo-400">Recent Trends</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Task Completion Trend */}
                    <div className="p-4 rounded-lg glass-card">
                      <h4 className="font-medium text-blue-400 mb-2">Task Completion</h4>
                      <div className="space-y-2">
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
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 bg-muted/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-blue-400 transition-all duration-300"
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
                    <div className="p-4 rounded-lg glass-card">
                      <h4 className="font-medium text-purple-400 mb-2">Mood Trend</h4>
                      <div className="space-y-2">
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
                              <span className="text-purple-400 font-medium ml-1">{savedEntry.ratings.mood || 0}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Insights */}
                <div className="p-4 rounded-lg glass-card border border-indigo-500/20">
                  <h4 className="font-medium text-indigo-400 mb-3">Personal Insights</h4>
                  <div className="space-y-2 text-sm">
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
            </MorphingCard>
          </ParallaxSection>
        )}

        <ParallaxSection speed={0.7} direction="up">
          <MorphingCard hoverScale={1.02} morphDuration={0.4} className="glass-accent border-l-4 border-l-purple-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                Goals & Tomorrow
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Areas to Improve Tomorrow */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-purple-400">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Areas to Improve Tomorrow
                </label>
                <Textarea
                  placeholder="What would you like to work on or do better tomorrow?"
                  value={entry.futureImprovements}
                  onChange={(e) => setEntry((prev) => ({ ...prev, futureImprovements: e.target.value }))}
                  className="glass-card min-h-[100px]"
                />
              </div>

              {/* Tomorrow's Priorities */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-purple-400">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Tomorrow's Top Priorities
                </label>
                <Textarea
                  placeholder="What are the 3 most important things you want to accomplish tomorrow?"
                  value={entry.tomorrowGoals}
                  onChange={(e) => setEntry((prev) => ({ ...prev, tomorrowGoals: e.target.value }))}
                  className="glass-card min-h-[100px]"
                />
              </div>

              {/* Daily Affirmation */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-purple-400">
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  Daily Affirmation
                </label>
                <Input
                  placeholder="A positive statement to carry forward into tomorrow..."
                  value={entry.affirmation}
                  onChange={(e) => setEntry((prev) => ({ ...prev, affirmation: e.target.value }))}
                  className="glass-card"
                />
              </div>
            </CardContent>
          </MorphingCard>
        </ParallaxSection>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button onClick={saveEntry} className="glass-primary px-8 py-3 text-lg hover:scale-105 transition-transform">
            <Save className="w-5 h-5 mr-2" />
            Save Today's Entry
          </Button>
        </div>

        {savedEntries.length > 0 && (
          <ParallaxSection speed={0.8} direction="up">
            <MorphingCard hoverScale={1.02} morphDuration={0.4} className="glass-card">
              <CardHeader>
                <CardTitle>
                  Recent Entries (
                  <AnimatedCounter value={savedEntries.length} duration={1} />
                  {" total"})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {savedEntries
                    .slice(-5)
                    .reverse()
                    .map((savedEntry, index) => (
                      <div key={index} className="p-3 rounded-lg glass-card border border-border/20">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{savedEntry.date}</span>
                          <span className="text-sm text-muted-foreground">{savedEntry.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {savedEntry.mainGoal || "No main goal set"}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            <AnimatedCounter
                              value={savedEntry.todos.filter((t) => t.completed).length}
                              duration={0.8}
                            />
                            /
                            <AnimatedCounter value={savedEntry.todos.length} duration={0.9} /> tasks
                          </Badge>
                          {savedEntry.todos.filter((t) => t.priority === "high" && t.completed).length > 0 && (
                            <Badge className="text-xs bg-red-500/20 text-red-300">
                              {savedEntry.todos.filter((t) => t.priority === "high" && t.completed).length} high
                              priority ✓
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </MorphingCard>
          </ParallaxSection>
        )}
      </div>
    </motion.div>
  )
}
