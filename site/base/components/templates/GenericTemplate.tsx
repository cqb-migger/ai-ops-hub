interface Props {
  children?: React.ReactNode;
}

export default function GenericTemplate({ children }: Props) {
  return <>{children}</>;
}
