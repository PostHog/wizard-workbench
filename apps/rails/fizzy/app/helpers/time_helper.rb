module TimeHelper
  def local_datetime_tag(datetime, style: :time, **attributes)
    # Render empty space to ensure it takes height until the local time is loaded via JS
    tag.time "&nbsp;".html_safe, **attributes, datetime: datetime.to_i, data: { local_time_target: style, action: "turbo:morph-element->local-time#refreshTarget" }
  end
end
