export const printContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        * {
            box-sizing: border-box;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            padding: 0;
            background: transparent;
        }

        .receipt {
            width: 80mm;
            padding: 15px;
            background: transparent;
        }

        .header {
                display: flex;
                flex-direction: column;
            text-align: center;
            margin-bottom: 20px;
        }

        .logo {
        display: block;
        margin: 0 auto;
        width: 100px;
    }


        .store-info {
            margin-bottom: 15px;
        }

        .transaction-info {
            margin: 15px 0;
        }

        .items {
            margin: 20px 0;
        }

        .item-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            text-align: left;
        }

        .item-name {
            flex: 2;
        }

        .item-qty {
            flex: 1;
            text-align: center;
        }

        .item-price {
            flex: 1;
            text-align: right;
        }

        .total {
            font-weight: bolder;
            border-top: 3px dashed #000;
            padding-top: 12px;
            margin-top: 12px;
        }

        .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <img src="https://bleaum-development.s3.us-east-2.amazonaws.com/655c9d0467d2c6a51eb3bc1f/57833cda956b4eb98f91cb13f4503d0b.png" class="logo" alt="Store Logo">
            <h2>Happyroot</h2>
        </div>

        <div class="store-info">
            <p>123 Downtown Street</p>
            <p>New York, NY 10001</p>
            <p>Tel: (212) 555-1234</p>
            <p>Email: happyroot@gmail.com</p>
        </div>

        <div class="transaction-info">
            <p>TRX ID: #3589024</p>
            <p>Date: 2023-11-15 14:30:45</p>
            <p>Cashier: John Doe</p>
            <p>Register: #05</p>
        </div>

        <div class="items">
            <div class="item-row">
                <span class="item-name">Items</span>
                <span class="item-qty">Qty</span>
                <span class="item-price">Price</span>
            </div>
            <div class="item-row">
                <span class="item-name">Bottled Water 500ml</span>
                <span class="item-qty">x2</span>
                <span class="item-price">$3.00</span>
            </div>
            <div class="item-row">
                <span class="item-name">Sandwich</span>
                <span class="item-qty">x1</span>
                <span class="item-price">$4.99</span>
            </div>
            <div class="item-row">
                <span class="item-name">Coffee Regular</span>
                <span class="item-qty">x1</span>
                <span class="item-price">$2.25</span>
            </div>
            <div class="item-row">
                <span class="item-name">Bag of Chips</span>
                <span class="item-qty">x1</span>
                <span class="item-price">$1.75</span>
            </div>
            <div class="item-row">
                <span class="item-name">Energy Drink</span>
                <span class="item-qty">x1</span>
                <span class="item-price">$3.50</span>
            </div>
        </div>

        <div class="total">
            <div class="item-row">
                <span class="item-name">Subtotal:</span>
                <span class="item-price">$15.49</span>
            </div>
            <div class="item-row">
                <span class="item-name">Tax (8%):</span>
                <span class="item-price">$1.24</span>
            </div>
            <div class="item-row">
                <span class="item-name">Total:</span>
                <span class="item-price">$16.73</span>
            </div>
        </div>

        <div class="payment-info">
            <p>Payment Method: Credit Card</p>
            <p>Last 4 Digits: 1234</p>
        </div>

        <div class="footer">
            <p>Thank you for shopping with us!</p>
        </div>
    </div>
</body>
</html>`;
