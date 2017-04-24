module OrderformsHelper
    
    def fase_status_text(status)
        case status
        when 0
            return "Meting"
        when 1
            return "Definitief"
        else
            return "Final"
        end
    end
    
    def orderform_type_image(status)
        case status
        when "Gordijnen"
            return image_tag("/images/orderform_icons/gordijnen_icon.png", :alt => "Gordijnen werkbon", :class => "edit_icon")
        when "Vloeren"
            return image_tag("/images/orderform_icons/vloeren_icon.png", :alt => "Vloeren werkbon", :class => "edit_icon")
        when "Vouwgordijnen"
            return image_tag("/images/orderform_icons/vouwgordijnen_icon.png", :alt => "Vouwgordijnen werkbon", :class => "edit_icon")
        when "Raamdecoratie"
            return image_tag("/images/orderform_icons/raamdecoratie_icon.png", :alt => "Raamdecoratie werkbon", :class => "edit_icon")
        when "Behang"
            return image_tag("/images/orderform_icons/behang_icon.png", :alt => "Behang werkbon", :class => "edit_icon")
        when "Karpetten"
            return image_tag("/images/orderform_icons/karpetten_icon.png", :alt => "Karpetten werkbon", :class => "edit_icon")
        else
            return image_tag("/images/orderform_icons/meubels_lampen_icon.png", :alt => "Meubels en lampen werkbon", :class => "edit_icon")
        end
    end
end