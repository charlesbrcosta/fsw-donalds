"use client"

import { OrderStatus, Prisma } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react"
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";

import { useCart } from "../../menu/context/cart";

interface OrderListProps {
    orders: Array<
        Prisma.OrderGetPayload<{
            include: {
                restaurant: {
                    select: {
                        name: true;
                        avatarImageUrl: true;
                    }
                }
                orderProducts: {
                    include: {
                        product:  true;
                    }
                }
            }
        }>
    >;
}

// Função auxiliar para verificar se o status é "PAYMENT_CONFIRMED" ou "FINISHED"
const isCompletedStatus = (status: OrderStatus) => ( 
    status === "PAYMENT_CONFIRMED" || status === "FINISHED"
)
const getStatusLabel = (status: OrderStatus) => {
    if (status === "FINISHED") return "Finalizado";
    if (status === "IN_PREPARATION") return "Em preparo";
    if (status === "PENDING") return "Pendente";
    if (status === "PAYMENT_CONFIRMED") return "Pagamento confirmado";
    if (status === "PAYMENT_FAILED") return "Pagamento falhou";
    return "";
}

const OrderList = ({orders}: OrderListProps) => {
    const router = useRouter();
    const { cleanBag } = useCart(); 
    const handleBackClick = () => {
        cleanBag();
        router.push("/fsw-donalds");
    };
    return ( 
        <div className="space-y-6 p-6">
            <Button size="icon" variant="secondary" className="rounded-full" onClick={handleBackClick}>
                <ChevronLeftIcon />
            </Button>
            <div className="flex items-center gap-3">
                <ScrollTextIcon />
                <h2 className="text-lg font-semibold">Meus pedidos</h2>
            </div>
            {orders.map(order => (
                <Card key={order.id}>
                    <CardContent className="p-5 space-y-4">
                        <div className={`w-fit rounded-full text-white px-2 py-1 text-xs font-semibold
                                ${isCompletedStatus(order.status) ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                        >
                            {getStatusLabel(order.status)}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative h-5 w-5">
                                <Image 
                                    src={order.restaurant.avatarImageUrl}
                                    alt={order.restaurant.name}
                                    fill
                                    className="rounded-sm"
                                />
                            </div>
                            <p className="text-sm font-semibold">{order.restaurant.name}</p>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            {order.orderProducts.map(orderProduct => (
                                <div key={orderProduct.id} className="flex items-center gap-2">
                                    <div className="h-5 w-5 flex items-center justify-center rounded-full bg-gray-400 text-white text-xs font-semibold">
                                        {orderProduct.quantity}
                                    </div>
                                    <p className="text-sm">{orderProduct.product.name}</p>
                                </div>
                            ))}
                        </div>
                        <Separator />
                        <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
                    </CardContent>
                </Card>
            ))}
        </div>     
    );
}
 
export default OrderList;