import React, { useEffect} from 'react';
import GenreList from './GenreList';
import '../mystyle.css';

const DataList = (props) => {
  const {
  	data
  } = props;

  return (
    data &&
      data.map((item, index) => (
        <a key={item.id} href={`/reactjs-for-native/${item.id}`} key={index}>
          <div className='Item'>
            <div className='ItemBox'>
              <GenreList data={item.genres} />

              <img
                src={item.coverImage.large}
                className='ItemImg'
                alt='item_image'
              />

              <div className='ItemName'>
                {item.title.userPreferred}
              </div>
            </div>
          </div>
        </a>
      ))
  );
}

const areEqual = (prevProps, nextProps) => {
  /*
  return true if passing nextProps to render would return
  the same result as passing prevProps to render,
  otherwise return false
  */
  if (prevProps.data !== nextProps.data) {
    return false;
  }

  return true;
}

export default React.memo(DataList, areEqual);
