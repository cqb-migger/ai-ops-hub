interface Props {
  social: {
    link: string;
    name: string;
  };
}
function FooterSocialItem({ social }: Props) {
  return (
    <li>
      <a href={social.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {social.name}
      </a>
    </li>
  );
}

export default FooterSocialItem;
