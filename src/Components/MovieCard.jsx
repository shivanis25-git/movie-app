function MovieCard({movie}){


return(


<div className="movie-card">


<img

src={

movie.poster_path

?

`https://image.tmdb.org/t/p/w500${movie.poster_path}`

:

"https://via.placeholder.com/200x300"

}

alt={movie.title}

/>



<h2>

{movie.title}

</h2>



<p>

📅 {movie.release_date}

</p>



<p>

⭐ {movie.vote_average}

</p>


</div>


)


}


export default MovieCard;