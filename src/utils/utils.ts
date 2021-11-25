import { MathUtils } from "./MathUtils";


export const sleep = (time: number): Promise<boolean> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(true), time);
  });
};

type FunctionModel = (...args: any) => any;

export function throttled(delay: number, fn: FunctionModel): FunctionModel {
  let lastCall = 0;
  return function (...args: any) {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return fn(...args);
  };
}

export function debounced(delay: number, fn: FunctionModel): FunctionModel {
  let timerId: any;
  return function (...args: any) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export const popupNewWindowCenter = (
  url: string,
  title: string,
  w: number,
  h: number,
  intervalCloseCheck = 1000,
  closeCallback: any = null
) => {
  const dualScreenLeft = window.screenLeft || window.screenX;
  const dualScreenTop = window.screenTop || window.screenY;

  const width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : window.screen.width;
  const height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : window.screen.height;

  const systemZoom = width / window.screen.availWidth;
  const left = (width - w) / 2 / systemZoom + dualScreenLeft;
  const top = (height - h) / 2 / systemZoom + dualScreenTop;
  const newWindow: any = window.open(
    url,
    title,
    "scrollbars=yes, width=" +
    w / systemZoom +
    ", height=" +
    h / systemZoom +
    ", top=" +
    top +
    ", left=" +
    left
  );

  if (typeof window['focus'] === 'function') {
    if (!newWindow) {
      alert('Votre navigateur internet bloque l\'ouverture d\'une fenêtre nécessaire à l\'action que vous souhaitez réaliser.\n\nNous vous invitons à autoriser l\'affichage des fenêtres pop-up sur votre navigateur internet ou à vous connecter depuis un autre navigateur internet.');
    } else {
      newWindow.focus();
    }
  }
  if (intervalCloseCheck) {
    let pollTimer = window.setInterval(function () {
      // !== is required for compatibility with Opera
      if (newWindow && newWindow.closed !== false) {
        window.clearInterval(pollTimer);
        closeCallback !== null && closeCallback();
      }
    }, intervalCloseCheck);
  }
};

export const reloadRouteIfSamePathname = (history: any, pathname: string) => {
  const current = history.location.pathname;
  if (current.includes(pathname)) {
    history.replace(`/reload`);
    sleep(100).then(() => history.replace(pathname));
  } else {
    history.push(pathname);
  }
};


export type Rgb = { r: number, g: number, b: number };
export type Rgba = { r: number, g: number, b: number, a: number }

export function isHex(value: string) {
  const reg = /[0-9A-Fa-f]{6}/g;
  return reg.test(value);
}

export function convertColorToRgbObject(color: string): Rgb | null {
  color = color.toLowerCase().replace(new RegExp(" ", "gm"), "");
  let result = null;
  if (isHex(color)) {
    const bigint = parseInt(color.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    result = { r, g, b };
  } else {
    return convertColorRgbToRgbObject(color);
  }
  return result;
}

function convertColorRgbToRgbObject(color: string): Rgb | null {
  const regexp = new RegExp("rgb\\(([0-9, .]+)\\)");
  if (regexp.test(color)) {
    const result = regexp.exec(color);
    if (result) {
      const intsStr = result[1];
      const ints = intsStr.split(",").map(str => parseFloat(str));
      return { r: ints[0], g: ints[1], b: ints[2] };
    }
  }
  return null;
}

export function convertColorToRgbaObject(rgba: string): Rgba | null {
  if (rgba.trim().startsWith("rgba")) {
    const regexp = new RegExp("rgb[a]{0,1}\\(([0-9, .]+)\\)");
    if (regexp.test(rgba)) {
      const result = regexp.exec(rgba);
      if (result) {
        const intsStr = result[1];
        const ints = intsStr.split(",").map(str => parseFloat(str));
        return { r: ints[0], g: ints[1], b: ints[2], a: ints[3] };
      }
    }
    return null;
  }
  return null;
}

export function convertColorToRgba(color: string, a: number) {
  const rgb = convertColorToRgbObject(color);
  if (rgb) {
    const { r, g, b } = rgb;
    return `rgba(${r},${g},${b},${a})`;
  }
  return null;
}

export function convertRgbaToHsla(r: number, g: number, b: number, a: number) {
  return { ...convertRgbToHsl(r, g, b), a };
}

export function convertRgbToHsl(r: number, g: number, b: number) {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === r) {
    h = ((g - b) / delta) % 6;
  } else if (cmax === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) {
    h += 360;
  }

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(MathUtils.convertFloatAmountToIntAmountMultiplyBy100(s)).toFixed(1);
  l = +(MathUtils.convertFloatAmountToIntAmountMultiplyBy100(l)).toFixed(1);

  return { h, s, l };
}

export function colorLuminance(color: string, lightness: number) {
  const obj = convertColorToRgbObject(color);
  if (obj) {
    const { r, g, b } = obj;
    const { h, s, l } = convertRgbToHsl(r, g, b);
    const res = l + lightness;
    const light = res < 0 ? Math.max(0, res) : Math.min(100, res);
    return `hsl(${h}, ${s}%, ${light}%)`;
  }
  return null;
}

export function colorRgbaLuminance(rgba: string, lightness: number) {
  const obj = convertColorToRgbaObject(rgba);
  if (obj) {
    const { r, g, b, a } = obj;
    const { h, s, l } = convertRgbaToHsla(r, g, b, a);
    const res = l + lightness;
    const light = res < 0 ? Math.max(0, res) : Math.min(100, res);
    return `hsla(${h}, ${s}%, ${light}%, ${a})`;
  }
  return null;
}

enum MobileType {
  ANDROID,
  BLACK_BERRY,
  IOS,
  OPERA,
  WINDOWS,
  I_PAD,
  ANY
}

export const isMobile = (mobile: MobileType = 5) => {
  let Mobile = {
    android() {
      return navigator.userAgent.match(/Android/i);
    },
    blackBerry() {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS() {
      return navigator.userAgent.match(/iPhone/i);
    },
    opera() {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    windows() {
      return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    iPad() {
      return navigator.userAgent.match(/iPad/i);
    },
    any() {
      return Mobile.android() || Mobile.blackBerry() || Mobile.iOS() || Mobile.opera() || Mobile.windows() || Mobile.iPad();
    }
  };
  let isMobile = false;
  switch (mobile) {
    case MobileType.ANY:
      isMobile = Mobile.any() !== null;
      break;
    case MobileType.BLACK_BERRY:
      isMobile = Mobile.blackBerry() !== null;
      break;
    case MobileType.IOS:
      isMobile = Mobile.blackBerry() !== null;
      break;
    case MobileType.WINDOWS:
      isMobile = Mobile.windows() !== null;
      break;
    case MobileType.OPERA:
      isMobile = Mobile.opera() !== null;
      break;
    case MobileType.ANDROID:
      isMobile = Mobile.android() !== null;
      break;
    case MobileType.I_PAD:
      isMobile = Mobile.iPad() !== null;
      break;
    default:
      isMobile = Mobile.any() !== null;
      break;
  }

  return isMobile;
}


export const isHTMLInputElement = (element: any): element is HTMLInputElement => 'value' in element;

export function escapeHtml(value: string) {
  const str = '' + value;
  const match = /["'&<>]/.exec(str);

  if (!match) {
    return str;
  }

  let escape;
  let html = '';
  let index, lastIndex = 0;

  for (index = match.index; index < str.length; index++) {
    switch (str.charCodeAt(index)) {
      case 34: // "
        escape = '&quot;';
        break;
      case 38: // &
        escape = '&amp;';
        break;
      case 39: // '
        escape = '&#39;';
        break;
      case 60: // <
        escape = '&lt;';
        break;
      case 62: // >
        escape = '&gt;';
        break;
      default:
        continue;
    }

    if (lastIndex !== index) {
      html += str.substring(lastIndex, index);
    }

    lastIndex = index + 1;
    html += escape;
  }

  return lastIndex !== index
    ? html + str.substring(lastIndex, index)
    : html;
}

