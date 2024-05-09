class NSUtils {
  static toMmol(mgdl) {
    return ((mgdl * ConversionFactor * 10) | 0) / 10;
  }
}
