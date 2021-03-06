class ArticlesController < ApplicationController
    before_action :authenticate_user!
    before_action :find_article, only: [:edit, :update, :destroy]

    def index
        @articles = Article.all
    end
    
    def new
        @article = Article.new
    end
    
    def create
        @article = Article.new article_params

        if @article.save
            flash[:notice] = "Het artikel is opgeslagen!"
            redirect_to action: "index"
        else
            render 'new'
            flash[:notice] = "Oh nee! Het artikel is niet opgeslagen."
        end
    end
    
    def edit
    end
    
    def update
        if @article.update article_params
            flash[:notice] = "Uw artikel is succesvol aangepast."
            redirect_to action: "index"
        else
            flash[:notice] = "Oh nee! Uw artikel kon niet opgeslagen worden."
            render 'edit'
        end
    end
    
    def destroy
        @article.destroy
        redirect_to action: "index"
    end
    
    private
    
    def article_params
        params.require(:article).permit(:omschrijving, :prijs, :eenheid)
    end
    
    def find_article
       @article = Article.find(params[:id]) 
    end

end
