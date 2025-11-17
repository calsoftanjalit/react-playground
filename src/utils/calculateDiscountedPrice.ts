
export const calculateDiscountedPrice = (price:string, percentage:string )=>{
       const priceInNumericValue:number = Number(price);
       const discountPercentage:number = Number(percentage);

       if(isNaN(priceInNumericValue) || isNaN(discountPercentage)) return 0;

       const discountAmount = (priceInNumericValue*discountPercentage)/100;

       const finalPrice = priceInNumericValue - discountAmount;
       return Number(finalPrice.toFixed(2))


}