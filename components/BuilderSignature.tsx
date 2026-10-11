import VasiaSignature from './VasiaSignature';
import type { Language } from '../types';

export default function BuilderSignature(_props: { lang: Language }) {
  return (
    <div data-builder-signature>
      <VasiaSignature />
    </div>
  );
}
