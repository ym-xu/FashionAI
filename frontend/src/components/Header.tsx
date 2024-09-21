import React from 'react'
import { Input } from "./ui/input"
import { Search } from "lucide-react"

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  children?: React.ReactNode;
}

export default function Header({ title, showSearch = true, children }: HeaderProps) {
  return (
    <header className="bg-background border-b p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
      {showSearch && (
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-8 w-full" />
        </div>
      )}
    </header>
  )
}