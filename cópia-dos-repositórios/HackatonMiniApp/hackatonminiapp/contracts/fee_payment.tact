// contracts/fee_payment.tact
import "@stdlib/deploy";

/// Payload de pagamento
message Payment {
  amount: Int as coins;
  recipient: Address;
}

/// Payload para atualizar a fee
message SetFee {
  numerator: Int as uint32;
  denominator: Int as uint32;
}

contract FeePayment(
  owner: Address,                  // quem recebe a taxa
  feeNumerator: Int as uint32,     // numerador da taxa
  feeDenominator: Int as uint32    // denominador da taxa
) {
  /// Recebe um pagamento e faz o split
  receive(msg: Payment) {
    let fee: Int = (msg.amount * self.feeNumerator) / self.feeDenominator;
    require(context().value >= msg.amount + fee, "Insufficient funds");

    // 1) envia o principal ao destinatário
    send(SendParameters{
      to: msg.recipient,
      value: msg.amount,
      bounce: false,
      mode: SendIgnoreErrors
    });

    // 2) envia a fee ao owner
    send(SendParameters{
      to: self.owner,
      value: fee,
      bounce: false,
      mode: SendIgnoreErrors
    });

    // 3) devolve qualquer excedente
    cashback(sender());
  }

  /// Getters para numerador/denominador
  get fun getFeeNumerator(): Int {
    return self.feeNumerator;
  }

  get fun getFeeDenominator(): Int {
    return self.feeDenominator;
  }

  /// Somente owner pode atualizar a fee
  receive(msg: SetFee) {
    require(sender() == self.owner, "Only owner can set fee");
    self.feeNumerator   = msg.numerator;
    self.feeDenominator = msg.denominator;
  }
}
