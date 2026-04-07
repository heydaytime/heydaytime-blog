import styles from './page.module.css'

export const metadata = {
  title: 'My Blog Title | heydaytime',
  description: 'Blog description goes here',
}

export default function BlogPost() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Your Blog Title Here</h1>
      <p className={styles.date}>April 6, 2026</p>
      
      <article className={styles.content}>
        <p>
          This is where your blog content goes. Replace this placeholder text with your actual blog post.
        </p>

        <h2>A Subheading</h2>
        
        <p>
          More content here. You can use standard HTML elements like paragraphs, headings, lists, blockquotes, and code blocks.
        </p>

        <blockquote>
          This is a blockquote for highlighting important text or quotes.
        </blockquote>

        <p>
          Here's an example of <code>inline code</code> formatting.
        </p>

        <ul>
          <li>List item one</li>
          <li>List item two</li>
          <li>List item three</li>
        </ul>

        <p>
          Continue writing your blog post here...
        </p>
      </article>
    </main>
  )
}
