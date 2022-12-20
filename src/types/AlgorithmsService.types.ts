export interface GenerateControlNumberInputI {
  mode: 1 | 2;
  factors: {
    firstId: number; // shenase avalie
    price?: number; // mablagh factor
  }[]
}
