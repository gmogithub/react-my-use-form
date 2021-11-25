export class StringUtils {
  static parse(value: string, values: Array<string>) {

    try {
      value = value.replace(/\$\[\[(.*?)\]\]/g, (s, n) => {
        return values[n];
      });
    } catch (e: any) {
      console.error(e.message);
    }

    return value;
  }

  static isEmpty(str: string) {
    return !str;
  }

  static capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static removeAccents(str: string) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    //   const accents =
    //     "ÀÁÂÃÄÅĄàáâãäåąßÒÓÔÕÕÖØÓòóôõöøóÈÉÊËĘèéêëęðÇĆçćÐÌÍÎÏìíîïÙÚÛÜùúûüÑŃñńŠŚšśŸÿýŽŻŹžżź";
    //   const accentsOut =
    //     "AAAAAAAaaaaaaaBOOOOOOOOoooooooEEEEEeeeeeeCCccDIIIIiiiiUUUUuuuuNNnnSSssYyyZZZzzz";
    //   return string
    //     .split("")
    //     .map((letter, index) => {
    //       const accentIndex = accents.indexOf(letter);
    //       return accentIndex !== -1 ? accentsOut[accentIndex] : letter;
    //     })
    //     .join("");
  }
}
