import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FilterContext } from '../config/ReactContext';
import { ToggleButton} from 'react-bootstrap';
import '../mystyle.css';

const FilterObject = ({ title, callbackPress }) => {
  const filterContext = useContext(FilterContext);
  const [filter, setFilter] = useState(filterContext.filterValue); // COPY ARRAY

  // UPDATE STATE JIKA ADA PERUBAHAN DATA CONTEXT
  useEffect (() => {
    setFilter(filterContext.filterValue);
  }, [filterContext.filterValue])

  const setChecked = async (object, i, name, value) => {
    // console.log('setChecked', object, i, name, value);
    let update = JSON.parse(JSON.stringify(filter)); // DEEP COPY ARRAY NEEDED!
    let filterParams = [];

    // TO REMOVE OBJECT FILTER
    const filterChecked = (item) => {
      // console.log(item, `"${name}"`);
      return item !== `"${name}"`;
    }

    // FILTER BY GENRES
    if (object === 'genres') {
      update[0][i].value = value;

      if (value === true) {
        update[1].count += 1;
        update[1].filter.push(`"${name}"`);
      }
      else {
        update[1].count -= 1;
        filterParams = update[1].filter.filter(filterChecked);
        update[1].filter = filterParams;
      }
    }

    // console.log(object, i, name, value);
    // console.log(update[1]);

    callbackPress(update);
    setFilter(update);
  };

  return (
    <>
      <p className='FilterTitle' key='FilterGenres-title'>{title}</p>  
      {
        filter[0].map((item, index) => (
          item.genre.toLowerCase() !== 'hentai' &&
            <ToggleButton
              key={`FilterGenres-${index}`}
              id={`FilterGenres-${index}`}
              className="FilterButton"
              size="sm"
              type="checkbox"
              variant="outline-primary"
              checked={item.value}
              onChange={(e) => setChecked('genres', index, item.genre, !item.value)}
            >
              {item.genre}
            </ToggleButton>
        ))
      }
    </>
  );
};

export default FilterObject;