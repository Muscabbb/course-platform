import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/pageHeader";
import { DollarSign, TrendingUp, ShoppingCart, Users } from "lucide-react";

export default async function SalesPage() {
  // Get sales data
  const [purchases, salesStats] = await Promise.all([
    prisma.purchase.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
        product: true,
      },
    }),
    prisma.purchase.aggregate({
      _sum: {
        pricePaidInCents: true,
      },
      _count: {
        id: true,
      },
    }),
  ]);

  const totalRevenue = salesStats._sum.pricePaidInCents || 0;
  const totalSales = salesStats._count.id || 0;
  const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Get unique customers
  const uniqueCustomers = new Set(purchases.map(p => p.userId)).size;

  return (
    <div className="container my-6">
      <PageHeader title="Sales Dashboard" />
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalRevenue / 100).toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSales}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCustomers}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(averageOrderValue / 100).toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {purchases.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No sales yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{purchase.user.email}</p>
                        <p className="text-sm text-muted-foreground">
                          {purchase.user.firstName} {purchase.user.lastName}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{purchase.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {purchase.product.description.substring(0, 50)}...
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        ${(purchase.pricePaidInCents / 100).toFixed(2)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(purchase.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={purchase.refundAt ? "destructive" : "default"}>
                        {purchase.refundAt ? "Refunded" : "Completed"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}