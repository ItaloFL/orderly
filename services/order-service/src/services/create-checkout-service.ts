import axios from "axios";

interface CreateCheckoutRequest {
  orderId: string;
  userId: string;
  total: number;
}

export class CreateCheckoutService {
  async execute({ orderId, userId, total }: CreateCheckoutRequest) {
    const { data } = await axios.post(
      `${process.env.PAYMENT_SERVICE_URL}/payments`,
      { orderId, userId, total }
    );

    return data; 
  }
}