export const formatCurrency = price => 
    Number(price).toLocaleString("es-ES", {
        style: "currency",
        currency: "EUR"
    })