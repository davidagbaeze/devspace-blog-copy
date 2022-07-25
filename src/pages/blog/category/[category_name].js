import fs from "fs";
import path from "path"
import Layout from "@/components/Layout";
import Link from 'next/link'
import matter from 'gray-matter'
import Post from "@/components/Post";
import {sortByDate} from "@/utils";


export default function HomePage({posts, categoryName}) {
  return (
    <Layout>
      <h1 className="text-5xl border-b-4 p-5 font-bold">Posts in {categoryName}</h1>
      <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-5'>
        {posts.map((post, index)=> (
          <Post key={index} post={post}/>
        ))}
      </div>
    </Layout>
  )
}



export async function getStaticPaths(){
  const files = fs.readdirSync(path.join('src/posts'))

  const categories = files.map(filename => {
    const markdownWithMeta = fs.readFileSync(path.join('src/posts', filename), 'utf-8')

    const{data: frontmatter} = matter(markdownWithMeta)

    return frontmatter.category.toLowerCase()
  })

  const paths = categories.map(category=> ({
    params: {category_name: category}
  }))

  return {
    paths,
    fallback: false
  }
}


export async function getStaticProps({params: {category_name}}){
  const files = fs.readdirSync(('src/posts'))

  const posts = files.map(filename =>{
    const slug = filename.replace('.md', '')
    const markdownWithMeta = fs.readFileSync(path.join('src/posts', filename),'utf-8')

    const{data: frontmatter} = matter(markdownWithMeta)

    return{
      slug,
      frontmatter
    }
  })

  const categoryPosts = posts.filter(post => post.frontmatter.category.toLowerCase() === category_name)

  return{
    props: {
      posts: categoryPosts.sort(sortByDate),
      categoryName: category_name
    }
  }
}