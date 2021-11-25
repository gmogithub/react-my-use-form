export class MathUtils {

  static VAT: number = 20;

  static computedTTC(priceHT: number, vat = MathUtils.VAT) {
    return Math.floor(priceHT * (1 + (vat / 100)));
  }

  static computedVAT(priceHT: number, vat = MathUtils.VAT) {
    return Math.floor(priceHT * (vat / 100));
  }

  static computedHT(priceTTC: number, vat = MathUtils.VAT) {
    return Math.floor(priceTTC / (1 + (vat / 100)));
  }

  static convertFloat(value: number, precision = 1) {
    const res = (value + "").trim();
    if (res.endsWith(".")) {
      return value;
    }
    return Number.parseFloat(value.toFixed(precision));
  }

  static convertStringAmountToIntAmountMultiplyBy100(value: string) {
    return MathUtils.convertFloatAmountToIntAmountMultiplyBy100(parseFloat(value));
  }

  static convertFloatAmountToIntAmountMultiplyBy100(value: number) {
    if (Number.isNaN(value))
      return 0;
    return Math.round(value * 100);
  }

  static convertIntAmountToFloatAmountDivideBy100(value: number) {
    if (Number.isNaN(value))
      return 0;
    return MathUtils.round(value / 100, 2);
  }

  static round(value: number, precision = 1) {
    if (Number.isNaN(value)) {
      console.error("Attention la valeur n'est pas un nombre");
      value = 0;
    }
    return Number.parseFloat(value.toFixed(precision));
  }
}
