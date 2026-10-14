function SearchBar({query,setQuery,searchMovie}){


return(


<div className="search-box">


<input

type="text"

placeholder="Search movie..."

value={query}

onChange={(e)=>setQuery(e.target.value)}

/>



<button onClick={searchMovie}>

Search

</button>


</div>


)


}


export default SearchBar;