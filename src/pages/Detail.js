import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Container, Col, Row, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import '../mystyle.css';
import Constants from '../config/Constants';
import MyNavbar from '../components/MyNavbar';
import MediaScore from '../components/MediaScore';

const url = 'https://graphql.anilist.co/';
const headers = { 'Content-Type': 'application/json' };
const appIcon = 'https://anilist.co/img/icons/icon.svg';

function Detail() {
  let { id } = useParams();
  const [error, setError] = useState([]);
  const [data, setData] = useState(true);
  const [loading, setLoading] = useState(true);

  // MOUNT FUNCTIONS CALL
  useEffect(() => {
    _getApi();
  }, []); // SET EMPTY ARRAY SO USEEFFECT JUST CALL ONCE

  const _getApi = async () => {
    try {
      await _getDetails();
      setLoading(false);
    }

    catch (e) {
      setError([
        <ToastContainer key='error' className="position-fixed p-3" position='bottom-end'>
          <Toast onClose={() => setError([])} delay={3000} autohide>
            <Toast.Header>
              <img src={appIcon} className="ToastImage" alt="toast-icon" />
              <strong className="me-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body>Hit API error!</Toast.Body>
          </Toast>
        </ToastContainer>
      ]);
    }
  };

  const _getDetails = useCallback (async () => {
    try {
      const query = {
        query : `{
          media: Media(id: ${id}) {
            id
            title { userPreferred }
            type
            genres
            format
            source
            status
            description
            season
            seasonYear
            startDate { year month day }
            chapters
            volumes
            episodes
            coverImage { large color }
            meanScore
            popularity
            trending
          }
        }`
      };

      const response = await axios.post(
        url,
        query,
        { headers }
      );
      
      setData(response.data.data.media);
      setError([]);
      
      // STRING TO RENDER HTML
      const desc = document.getElementById('desc');
      desc.innerHTML = response.data.data.media.description;
    }

    catch (e) {
      setError([
        <ToastContainer key='error' className="position-fixed p-3" position='bottom-end'>
          <Toast onClose={() => setError([])} delay={3000} autohide>
            <Toast.Header>
              <img src={appIcon} className="ToastImage" alt="toast-icon" />
              <strong className="me-auto">Warning</strong>
            </Toast.Header>
            <Toast.Body>Hit API error!</Toast.Body>
          </Toast>
        </ToastContainer>
      ]);
    }

  }, [id]);

  // RENDER
  return (
    loading
      ?
      <div className='LoadingContainer'>
        <img
          src={appIcon}
          className="Loading"
          alt="logo"
        />

        { error.length > 0 && error }
      </div>

      :
      <div className='Content'>
        <MyNavbar hasBack={true} />

        <div className='Profile window' style={{ backgroundColor: `${data.coverImage.color}`}}>
          <Container className='MediaBox'>
            <Col className='MediaImageCol' xs={5} sm={5} md={3} lg={3}>
              <Row className='MediaImageRow'>
                <div className='MediaImageRow'>
                  <MediaScore score={data.meanScore} />
                  <img
                    src={data.coverImage.large}
                    className='CoverImage'
                    alt='item_image'
                  />
                </div>
              </Row>
            </Col>
            
            <Col className='MediaInfo' xs={7} sm={7} md={3} lg={3}>
              <Row className='MediaTitle'>
                {data.title.userPreferred}
              </Row>
              
              <Row className='MediaData'>
                <Col className='MediaLabel' xs={3} sm={3} md={3} lg={3}>Status</Col>
                <Col className='MediaText' xs={9} sm={9} md={9} lg={9}>: {data.status}</Col>
              </Row>
              
              <Row className='MediaData'>
                <Col className='MediaLabel' xs={3} sm={3} md={3} lg={3}>Start Date</Col>
                <Col className='MediaText' xs={9} sm={9} md={9} lg={9}>: {data.startDate.day} {Constants.months[data.startDate.month]} {data.startDate.year}</Col>
              </Row>
            </Col>
          </Container>



          <div id='desc' className='MediaDescription'></div>
        </div>
          

        { error.length > 0 && error }
      </div>
  );
}

export default Detail;
  