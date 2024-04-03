import React from 'react';
import {useSelector} from 'react-redux';
import {Icon} from 'semantic-ui-react';

const ScrollToTopButton = ({scrollRef}) => {
  // using hidden to prevent unsightly blue halo on mobile after trigger
  const [hidden, setHidden] = React.useState(false);
  const {sliceScrollPosition} = useSelector((i) => i.view);

  const handleScrollClick = () => {
    setHidden(true);
    scrollRef.current.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // timer to reset hidden
  React.useEffect(() => {
    if (hidden) {
      const thisTimeout = setTimeout(() => {
        setHidden(false);
      }, 1000);

      return () => clearTimeout(thisTimeout);
    }

  }, [hidden]);

  // only display button if not already at top
  if (sliceScrollPosition === 0 || hidden) {
    return null;
  }

  return (
    <Icon
      className = 'slice-scroll-to-top-container'
      fitted
      name = 'arrow alternate circle up'
      onClick = {handleScrollClick}
      size = 'big'/>
  );
};

export default ScrollToTopButton;

