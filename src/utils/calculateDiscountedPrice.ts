
export const calculateDiscountedPrice = (price:number, percentage:number )=>{
       if(isNaN(price) || isNaN(percentage)) return 0;
       const discountAmount = (price*percentage)/100;
       const finalPrice = price - discountAmount;
       return Number(finalPrice.toFixed(2))
}