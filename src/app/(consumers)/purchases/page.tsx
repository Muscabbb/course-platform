import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/services/clerk";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { ShoppingCart, ExternalLink } from "lucide-react";
import Link from "next/link";

export default async function PurchasesPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/sign-in");
  }

  // Get user's purchase history
  const purchases = await prisma.purchase.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          courses: {
            include: {
              course: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Calculate total spent
  const totalSpent = purchases.reduce(
    (total, purchase) => total + purchase.pricePaidInCents,
    0
  );

  return (
    <div className="container my-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Purchase History</h1>
        <p className="text-muted-foreground">
          View all your course purchases and download receipts.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(totalSpent / 100).toFixed(2)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses Owned</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchases.reduce(
                (total, purchase) => total + purchase.product.courses.length,
                0
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchases Table */}
      {purchases.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No purchases yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't made any purchases yet. Start learning today!
            </p>
            <Button asChild>
              <Link href="/">Browse Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{purchase.product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {purchase.product.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {purchase.product.courses.map((courseProduct) => (
                          <div key={courseProduct.course.id} className="flex items-center gap-2">
                            <Link 
                              href={`/courses/${courseProduct.course.id}`}
                              className="text-sm hover:underline"
                            >
                              {courseProduct.course.name}
                            </Link>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">
                        ${(purchase.pricePaidInCents / 100).toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {formatDate(purchase.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          Download Receipt
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}