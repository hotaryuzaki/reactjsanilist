import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { Container, Col, Row, Toast, ToastContainer } from 'react-bootstrap';
import axios from 'axios';
import parse from "html-react-parser";
import '../mystyle.css';
import Constants from '../config/Constants';
import MyNavbar from '../components/MyNavbar';
import MediaScore from '../components/MediaScore';
import GenreList from '../components/GenreList';

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
            averageScore
            meanScore
            popularity
            trending
          }
        }`
      };

      const response = await axios.post(
        Constants.url,
        query,
        { headers }
      );
      
      setData(response.data.data.media);
      setError([]);
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

        <Container className='Profile window' style={{ backgroundColor: `${data.coverImage.color}`}}>
          <div className='MediaBox'>
            <Col className='MediaCol' xs={5} sm={5} md={4} lg={4}>
              <Row className='MediaRow'>
                <Col className='MediaImageContainer'>
                  <MediaScore score={data.averageScore} />
                  
                  <img
                    src={data.coverImage.large}
                    className='CoverImage'
                    alt='item_image'
                  />
                </Col>
              </Row>

              <Row className='MediaRow p-2'>
                <Row className='MediaData'>
                  <Col className='MediaLabel' xs={12} sm={3} md={4} lg={3}>Status</Col>
                  <Col className='MediaText' xs={12} sm={9} md={8} lg={9}>: {data.status}</Col>
                </Row>
                
                <Row className='MediaData'>
                  <Col className='MediaLabel' xs={12} sm={3} md={4} lg={3}>Start Date</Col>
                  <Col className='MediaText' xs={12} sm={9} md={8} lg={9}>: {data.startDate.day} {Constants.months[data.startDate.month]} {data.startDate.year}</Col>
                </Row>
                
                <Row className='MediaData'>
                  <Col className='MediaLabel' xs={12} sm={3} md={4} lg={3}>Format</Col>
                  <Col className='MediaText' xs={12} sm={9} md={8} lg={9}>: {data.format}</Col>
                </Row>
                
                <Row className='MediaData'>
                  <Col className='MediaLabel' xs={12}sm={3} md={4} lg={3}>Source</Col>
                  <Col className='MediaText' xs={12} sm={9} md={8} lg={9}>: {data.source}</Col>
                </Row>
                
                <Row className='MediaData'>
                  <Col className='MediaLabel' xs={12} sm={3} md={4} lg={3}>Episodes</Col>
                  <Col className='MediaText' xs={12} sm={9} md={8} lg={9}>: {data.episodes}</Col>
                </Row>
                
                <Row className='MediaData'>
                  <Col className='MediaLabel' xs={12} sm={3} md={4} lg={3}>Popularity</Col>
                  <Col className='MediaText' xs={12} sm={9} md={8} lg={9}>: {data.popularity}</Col>
                </Row>
                
                <Row className='MediaData'>
                  <Col className='MediaLabel' xs={12} sm={3} md={4} lg={3}>Trending</Col>
                  <Col className='MediaText' xs={12} sm={9} md={8} lg={9}>: {data.trending}</Col>
                </Row>
              </Row>
            </Col>
            
            <Col className='MediaInfoCol' xs={7} sm={7} md={8} lg={8}>
              <div className='MediaInfoContainer'>
                <div className='MediaTitle'>{data.title.userPreferred}</div>
                <div className='MediaTitleSeparator' />
                <div className='GenreList'>
                  <GenreList data={data.genres} limit={100}/>
                </div>
                <div id='desc' className='MediaDescription'>
                  { data.description ? parse(data.description) : '' }
                </div>
              </div>
            </Col>
          </div>
        </Container>
          

        { error.length > 0 && error }
      </div>
  );
}

export default Detail;
  