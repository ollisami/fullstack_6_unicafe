const dummy = (blogs) => {
   return 1
  }

  const totalLikes = (blogs) => {
    var sum = 0
    blogs.forEach(blog => {
        sum+=blog.likes
    })
    return sum
   }

   const favoriteBlog = (blogs) => {
    var fav = blogs[0]
    blogs.forEach(blog => {
        fav = fav.likes > blog.likes ? fav : blog
    })
    return fav
   }

   const mostBlogs = (blogs) => {
    var map =new Map()
    blogs.forEach(blog => {
        if (map.get(blog.author)) map.set(blog.author, map.get(blog.author) +1)
        else map.set(blog.author,1)
    })

    var name  = ""
    var count = 0
    for (var [key, value] of map.entries()) {
        if(value > count) {
            count = value
            name = key
        }
      }
    return   {
        author: name,
        blogs: count
      } 
   }

   const mostLikes = (blogs) => {
    var map =new Map()
    blogs.forEach(blog => {
        if (map.get(blog.author)) map.set(blog.author, map.get(blog.author) + blog.likes)
        else map.set(blog.author,blog.likes)
    })

    var name  = ""
    var count = 0
    for (var [key, value] of map.entries()) {
        if(value > count) {
            count = value
            name = key
        }
      }
    return   {
        author: name,
        likes: count
      } 
   }
  
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }