<div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentView('blog')}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <BookOpen className="w-4 h-4" />
            Blog
          </button>
          <button
            onClick={() => setCurrentView('article-generator')}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <Sparkles className="w-4 h-4" />
            Generate Article
          </button>
          <button
            onClick={() => setCurrentView('create')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Poll
          </button>
        </div>
      </div>
    </div>
  </nav>

  <main className="py-8 px-4 sm:px-6 lg:px-8">
    {currentView === 'home' && renderHome()}
    {currentView === 'create' && renderCreatePoll()}
    {currentView === 'blog' && renderBlog()}
    {currentView === 'blog-post' && renderBlogPost()}
    {currentView === 'article-generator' && renderArticleGenerator()}
  </main>

  {/* AI Support Chatbot */}
  {!chatOpen && (
    <button
      onClick={() => setChatOpen(true)}
      className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="w-6 h-6" />
        <span className="font-semibold">Need Help?</span>
      </div>
    </button>
  )}

  {chatOpen && (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-lg shadow-2xl z-50 flex flex-col" style={{height: '500px'}}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <h3 className="font-semibold">AI Support</h3>
        </div>
        <button onClick={() => setChatOpen(false)} className="text-white hover:text-gray-200">
          ✕
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isChatLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
              Typing...
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            placeholder="Ask a question..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleChatSubmit}
            disabled={isChatLoading || !chatInput.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )}

  <footer className="bg-white border-t mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><button onClick={() => setCurrentView('create')} className="hover:text-blue-600">Create Poll</button></li>
            <li><button onClick={() => setCurrentView('home')} className="hover:text-blue-600">Features</button></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><button onClick={() => setCurrentView('blog')} className="hover:text-blue-600">Blog</button></li>
            <li><button onClick={() => setCurrentView('article-generator')} className="hover:text-blue-600">Article Generator</button></li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-3">SEO Keywords</h3>
          <p className="text-xs text-gray-500">
            Free poll maker, online surveys, create polls, polling tool, survey creator, 
            student engagement, classroom polls, quick feedback
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">PollGenius</h3>
          <p className="text-sm text-gray-600">
            Create beautiful polls in seconds with AI-powered features.
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
        © 2026 PollGenius - Free Online Poll Maker
      </div>
    </div>
  </footer>
</div>