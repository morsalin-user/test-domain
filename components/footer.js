export function Footer() {
    return (
      <footer className="border-t border-purple-500/20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4">
                AuraVerse
              </div>
              <p className="text-gray-400 text-sm">
                Empowering creators, one download at a time. Share and discover amazing Minecraft content.
              </p>
            </div>
  
            <div>
              <h3 className="text-purple-100 font-semibold mb-3">Browse</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/browse?category=plugins" className="text-gray-400 hover:text-purple-300">
                    Plugins
                  </a>
                </li>
                <li>
                  <a href="/browse?category=mods" className="text-gray-400 hover:text-purple-300">
                    Mods
                  </a>
                </li>
                <li>
                  <a href="/browse?category=maps" className="text-gray-400 hover:text-purple-300">
                    Maps
                  </a>
                </li>
                <li>
                  <a href="/browse?category=textures" className="text-gray-400 hover:text-purple-300">
                    Texture Packs
                  </a>
                </li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-purple-100 font-semibold mb-3">Community</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/requests" className="text-gray-400 hover:text-purple-300">
                    Request Resources
                  </a>
                </li>
                <li>
                  <a href="/upload" className="text-gray-400 hover:text-purple-300">
                    Upload Content
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300">
                    Discord Server
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300">
                    Guidelines
                  </a>
                </li>
              </ul>
            </div>
  
            <div>
              <h3 className="text-purple-100 font-semibold mb-3">Support</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-purple-300">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
  
          <div className="border-t border-purple-500/20 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 AuraVerse. All rights reserved. Made with ❤️ for the Minecraft community.
            </p>
          </div>
        </div>
      </footer>
    )
  }
  