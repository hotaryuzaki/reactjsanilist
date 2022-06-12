const GenreList = (props) => {
  return (
    props.data.map((genre, index) => {
      if (index < 1) {
        return (
          <p className="ItemGenre" key={index}>
            {genre}
          </p>
        );
      }

      return false;
    })
  )
}

export default GenreList;