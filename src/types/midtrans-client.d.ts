declare module 'midtrans-client' {
  interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
  }

  interface SnapParameter {
    transaction_details: TransactionDetails;
    customer_details?: CustomerDetails;
    [key: string]: any;
  }

  interface SnapTransaction {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(config: SnapConfig);
    createTransaction(parameter: SnapParameter): Promise<SnapTransaction>;
  }

  const midtransClient: {
    Snap: typeof Snap;
  };

  export = midtransClient;
}
