import Header from '../components/Header'
import { Button } from '../components/ui/button'
import { ScrollArea } from "../components/ui/scroll-area"
import {
  ChevronRight,
  Plus,
} from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Dashboard" />

      {/* Dashboard Content */}
      <ScrollArea className="h-[calc(100vh-5rem)] p-6">
        <h2 className="text-2xl font-bold mb-6">Welcome back, User!</h2>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button className="h-24 text-lg font-semibold">
            <Plus className="mr-2 h-5 w-5" /> New Project
          </Button>
          <Button variant="outline" className="h-24 text-lg font-semibold">
            Browse Marketplace
          </Button>
          <Button variant="outline" className="h-24 text-lg font-semibold">
            View Tutorials
          </Button>
        </div>

        {/* Recent Projects */}
        <h3 className="text-xl font-semibold mb-4">Recent Projects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((project) => (
            <div key={project} className="border rounded-lg p-4 space-y-2">
              <div className="aspect-video bg-muted rounded-md"></div>
              <h4 className="font-semibold">Project {project}</h4>
              <p className="text-sm text-muted-foreground">Last edited 2 days ago</p>
            </div>
          ))}
        </div>

        {/* Marketplace Highlights */}
        <h3 className="text-xl font-semibold mb-4">Marketplace Highlights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {["Popular Styles", "New Arrivals", "Top Rated", "Special Offers"].map((category) => (
            <Button key={category} variant="outline" className="h-20 text-lg font-semibold justify-between">
              {category} <ChevronRight className="h-5 w-5" />
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}