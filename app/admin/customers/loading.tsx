import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead className="text-right">
                    <Skeleton className="h-4 w-8 ml-auto" />
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`loading-row-${i}`}>
                    <TableCell>
                      <Skeleton className="h-8 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-8 w-40" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-8 w-12" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-8 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-8 w-24" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 ml-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
