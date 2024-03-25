import React from 'react';
import {useSelector} from 'react-redux';
import {Button, Image, Transition} from 'semantic-ui-react';
import TagGroup from './TagGroup';

const SliceImage = ({slice}) => {
  // max and min height the image can take
  const maxHeight = 70;
  const minHeight = 10;
  const heightIncrement = 10; // amount it changes by +/-
  const borderThreshold = 20; // min size for a border to kick in
  const [imageHeight, setImageHeight] = React.useState(40);
  const [imageSrc, setImageSrc] = React.useState(null);
  const [visible, setVisible] = React.useState(true); // used to cross fade images
  const [changeDirection, setChangeDirection] = React.useState(null); // can be + or -
  const {token} = useSelector((i) => i.user);
  const {loadedId} = useSelector((i) => i.stream);
  const {imageRes} = useSelector((i) => i.view);

  // event handlers
  const handleFadeOut = (direction) => {
    setVisible(false);
    setChangeDirection(direction);
  };

  const handleFadeIn = () => {
    if (changeDirection === '+') setImageHeight(imageHeight + heightIncrement);
    if (changeDirection === '-') setImageHeight(imageHeight - heightIncrement);

    setVisible(true);
  };

  // fetches image using using authorization header
  React.useEffect(() => {
    // base url for image
    const srcBase = `${BACKEND_URL}/media/${loadedId}/${slice.id}_${imageRes}_${slice.imageName}`; // eslint-disable-line no-undef

    // function adding authorization header to image request
    const fetchAuthorized = async () => {
      const headers = {'Authorization': `Bearer ${token}`};
      const imageData = await fetch(srcBase, {cache: 'force-cache', headers});
      const imageBlob = await imageData.blob();
      const imageUrl = URL.createObjectURL(imageBlob);

      setImageSrc(imageUrl);
    };

    fetchAuthorized();

    // don't want a bunch of image urls clogging up memory
    return () => {
      URL.revokeObjectURL(imageSrc);
    };

  }, [slice]);

  // keeps the slice at the right height while the image is loading
  if (!imageSrc) return (
    <div className = 'slice-image-group-container'>
      <div className = 'slice-image' style = {{height: `${imageHeight}vh`}}>
      </div>
      <TagGroup slice = {slice} />
    </div>
  );

  return (
    <div className = 'slice-image-group-container'>
      <div
        className = {imageHeight > borderThreshold
          ? 'slice-image-container'
          : 'slice-image-container-border'}>
        <Transition
          animation = 'fade'
          duration = {300}
          mountOnShow = {false}
          onHide = {handleFadeIn}
          transitionOnMount = {true}
          visible = {visible}>
          <Image
            className = 'slice-image'
            style = {{height: `${imageHeight}vh`}}
            src = {imageSrc}/>
        </Transition>
      </div>
      <div className = 'slice-image-bottom-row'>
        <TagGroup slice = {slice}/>
        <div className = 'slice-image-size-button-container'>
          <Button
            compact
            disabled = {imageHeight === maxHeight}
            icon = 'plus'
            onClick = {() => handleFadeOut('+')}
            size = 'mini'/>
          <Button
            compact
            disabled = {imageHeight === minHeight}
            icon = 'minus'
            onClick = {() => handleFadeOut('-')}
            size = 'mini' />
        </div>
      </div>
    </div>
  );
};

export default SliceImage;