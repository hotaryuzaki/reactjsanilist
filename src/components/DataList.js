import React, { useEffect} from 'react';
import { Col, Row } from 'react-bootstrap';
import GenreList from './GenreList';
import '../mystyle.css';

const DataList = (props) => {
  const {
  	data
  } = props;

  return (
    data &&
      data.map((item, index) => (
        <a key={item.id} href={`/reactjs-anilist/${item.id}`} key={index}>
          <Col className='Item' xs={6} sm={6} md={3} lg={3}>
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
          </Col>
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
