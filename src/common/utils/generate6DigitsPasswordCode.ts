export function generate6DigitsPasswordCode() {
  let code = '';

  while (code.length < 6) {
    const [digit] = String(Math.random() * 100).split('');

    code += digit;
  }

  return code;
}