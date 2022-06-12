const GenreList = (props) => {
  return (
    props.data.map((genre, index) => {
      if (index < props.limit) {
        return (
          <div className="ItemGenre" key={index}>
            {genre}
          </div>
        );
      }

      return false;
    })
  )
}

export default GenreList;