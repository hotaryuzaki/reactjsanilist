const GenreList = ({ data, limit }) => {
  return (
    data &&
      data.map((genre, index) => {
        if (index < limit) {
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