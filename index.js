import getFormByConfig from './demo/src/getFormByConfig';
import { defaultTheme as baseTheme } from './demo/src/theme';
import BaseFieldWrapper from './demo/src/components/DefaultFieldWrapper';
import baseTypes from './demo/src/types';
import baseValidation from './demo/src/validation';

export const defaultTheme = baseTheme;
export const defaultTypes = baseTypes;
export const defaultValidation = baseValidation;
export const DefaultFieldWrapper = BaseFieldWrapper;

export default getFormByConfig;
