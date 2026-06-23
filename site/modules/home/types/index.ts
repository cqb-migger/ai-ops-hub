import { FunctionComponent } from 'react';

export interface FeatureItem {
  name: string;
  label: string;
  title: string;
  description: string;
  img: FunctionComponent;
  active: boolean;
}
