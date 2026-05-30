import { Card, CardContent } from "./ui/card";


const StatCard = ({ label, value, icon: Icon } : { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) => {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between p-5">
        <div className="flex flex-col">
          <span className="text-lg font-medium text-muted-foreground">{label}</span>
          <span className="mt-1 text-2xl font-semibold text-foreground">{value}</span>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard