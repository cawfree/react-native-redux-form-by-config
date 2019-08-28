export const isRequired = label => value => value ? undefined : `${label} is required.`;

export const maxLength = (label, max) => value =>
    value && value.length > max ? `${label} must be ${max} characters or less.` : undefined;

export const minLength = (label, min) => value =>
    value && value.length < min ? `${label} must be ${min} characters or more.` : undefined;

export const isEmail = value =>
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ?
      'This E-Mail Address doesn\'t look right.' : undefined

export default {
  date: (config) => {
    const {
      label,
      required,
    } = config;
    return [
      (!!required) && isRequired(label),
    ]
      .filter(e => !!e);
  },
  text: (config) => {
    const {
      label,
      required,
      min,
      max,
      textContentType,
    } = config;
    return ([
      required && isRequired(label),
      max && maxLength(label, max),
      min && minLength(label, min),
      textContentType === 'emailAddress' && isEmail,
    ])
      .filter(e => !!e);
  },
  boolean: (config) => {
    const { label, required } = config;
    return [
      required && isRequired(label),
    ]
      .filter(e => !!e);
  },
  enum: (config) => {
    const { label, required } = config;
    return [
      required && isRequired(label),
    ]
      .filter(e => !!e);
  },
};
