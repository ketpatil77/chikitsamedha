from __future__ import annotations

import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

def build_pdf_bytes(info: dict) -> bytes:
    """Generate a simple PDF report and return bytes."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    
    # Register a font that supports Marathi characters
    try:
        pdfmetrics.registerFont(TTFont('NotoSansDevanagari', 'NotoSansDevanagari-Regular.ttf'))
        styles = getSampleStyleSheet()
        styles['BodyText'].fontName = 'NotoSansDevanagari'
        styles['Title'].fontName = 'NotoSansDevanagari'
    except:
        styles = getSampleStyleSheet()

    story = []
    story += [Paragraph("<b>Chikitsāmedhā – Report</b>", styles["Title"]), Spacer(1, 12)]
    
    for k, v in (info or {}).items():
        if k == 'Explanation_en':
            story += [Paragraph("<b>Explanation (English)</b>", styles["h3"]), Paragraph(v, styles["BodyText"]), Spacer(1, 12)]
        elif k == 'Explanation_mr':
            story += [Paragraph("<b>स्पष्टीकरण (मराठी)</b>", styles["h3"]), Paragraph(v, styles["BodyText"]), Spacer(1, 12)]
        else:
            story += [Paragraph(f"<b>{k}</b>: {v}", styles["BodyText"])]
            
    doc.build(story)
    buffer.seek(0)
    return buffer.read()

