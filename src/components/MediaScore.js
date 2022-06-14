const MediaScore = ({ score }) => {
  return (
    score &&
      <div className="MediaScore">
        {score}%
      </div>
  )
}

export default MediaScore;