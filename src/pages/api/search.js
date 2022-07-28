import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'


export default function handler(req, res) {
  let posts
  
  if(process.env.NODE_ENV=== 'production'){
    //
  }else {
    const files = fs.readdirSync(path.join('src/posts'))
    posts = files.map(filename =>{
      const markdownWithMeta = fs.readFileSync(path.join('src/posts', filename), 'utf-8')
      const {data: frontmatter} = matter(markdownWithMeta)

      return{
        frontmatter
      }
    })

  }

  const results = posts.filter(({frontmatter:{title, category,excerpt}})=>
    title.toLowerCase().indexOf(req.query.q) != -1 ||
    category.toLowerCase().indexOf(req.query.q) != -1 ||
    excerpt.toLowerCase().indexOf(req.query.q) != -1 
  )
  
  res.status(200).json(JSON.stringify({results}))
}
