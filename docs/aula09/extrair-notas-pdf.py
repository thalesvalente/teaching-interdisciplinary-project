"""Extrai notas de comprovantes PPI-A09-PDF-1, sem gravar em planilhas.

Uso: python extrair-notas-pdf.py entregas.zip --saida notas-aula09.csv
Requer pypdf e gabaritos v15/v16 no mesmo diretório. A coluna nota usa a escala 0–10.
"""
from __future__ import annotations

import argparse
import csv
import io
import json
import re
from collections import Counter
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
from zipfile import ZipFile

from pypdf import PdfReader

BANKS = {
    version: (json.loads(Path(__file__).with_name(filename).read_text(encoding="utf-8")), maximum)
    for version, filename, maximum in [
        ("PPI-A09-LAB-1.5", "gabarito-aula09-v15.json", Decimal("4")),
        ("PPI-A09-LAB-1.6", "gabarito-aula09-v16.json", Decimal("10")),
    ]
}
ENROLLMENT = r"[0-9]{8}\.ITA[0-9]{4}"
RECORD = re.compile(r"^QID:\s*((?:EDA|MEM)-Q[0-9]{2})\s*\|\s*RESPOSTA:\s*(O[1-4]|PENDENTE)\s*\|\s*PONTOS:\s*([0-9]+,[0-9]{2,3})\s*\|\s*TENTATIVAS:\s*([0-9]+)\s*\|\s*PISTAS:\s*([0-9]+)\s*$", re.M)
FIELDS = ["matricula", "nota", "atividade", "trilha", "status", "arquivo", "conferencia"]


def field(text, name, pattern):
    matches = re.findall(rf"^\s*{name}:\s*({pattern})\s*$", text, re.M)
    if len(matches) != 1:
        raise ValueError(f"Campo {name} ausente, duplicado ou inválido.")
    return matches[0]


def read_pdf(content, filename):
    pages = PdfReader(io.BytesIO(content)).pages
    text = "\n".join(page.extract_text() or "" for page in pages)
    field(text, "FORMATO_PDF", r"PPI-A09-PDF-1")
    activity = field(text, "ATIVIDADE", r"PPI1-4B")
    version = field(text, "VERSAO_ATIVIDADE", r"PPI-A09-LAB-[0-9.]+")
    if version not in BANKS:
        raise ValueError("Versão sem gabarito conferido.")
    bank, maximum = BANKS[version]
    if activity != bank["atividade"]:
        raise ValueError("Atividade sem gabarito conferido.")
    question_points = maximum / Decimal("16")
    track = field(text, "TRILHA", r"EDA|MEMORIAS")
    status = field(text, "STATUS", r"CONCLUIDA|PARCIAL")
    reported_maximum = Decimal(field(text, "NOTA_MAXIMA", r"(?:4|10),00").replace(",", "."))
    if reported_maximum != maximum:
        raise ValueError("Nota máxima inválida.")
    declared = Decimal(field(text, "NOTA_FINAL", r"(?:[0-9]|10),[0-9]{2}").replace(",", "."))
    declared_resolved = int(field(text, "QUESTOES_RESOLVIDAS", r"[0-9]{1,2}/16").split("/")[0])
    enrollments = re.findall(rf"^\s*MATRICULA:\s*({ENROLLMENT})\s*$", text, re.M)
    declared_enrollments = int(field(text, "TOTAL_INTEGRANTES", r"[0-9]+"))
    if not enrollments or len(set(enrollments)) != len(enrollments) or len(enrollments) != declared_enrollments:
        raise ValueError("Matrículas ausentes ou duplicadas dentro do PDF.")
    records = RECORD.findall(text)
    key = bank["chaves"][track]
    if len(records) != 16 or set(r[0] for r in records) != set(key):
        raise ValueError("Faltam questões, há duplicidade de QID ou as questões pertencem a outra trilha.")
    computed = Decimal("0")
    for qid, selected, points, attempts, hints in records:
        expected = question_points if selected == key[qid] else Decimal("0")
        if expected != Decimal(points.replace(",", ".")):
            raise ValueError(f"Pontuação divergente da resposta em {qid}.")
        if int(hints) > 2 or (selected == "PENDENTE") != (int(attempts) == 0):
            raise ValueError(f"Histórico de tentativas inválido em {qid}.")
        computed += expected
    resolved = int(computed / question_points)
    rounded = computed.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    normalized = (Decimal(resolved) * Decimal("10") / Decimal("16")).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    if rounded != declared or resolved != declared_resolved or (status == "CONCLUIDA") != (resolved == 16):
        raise ValueError("Nota, quantidade de questões resolvidas ou status divergente do gabarito.")
    return [
        dict(matricula=student, nota=f"{normalized:.2f}".replace(".", ","), atividade=activity,
             trilha=track, status=status, arquivo=filename, conferencia="OK")
        for student in enrollments
    ]


def iter_pdfs(path):
    if path.is_dir():
        for f in sorted(path.rglob("*.pdf")):
            yield str(f.relative_to(path)), f.read_bytes()
    elif path.suffix.lower() == ".zip":
        with ZipFile(path) as zipped:
            for member in zipped.infolist():
                if not member.is_dir() and member.filename.lower().endswith(".pdf"):
                    yield member.filename, zipped.read(member)
    elif path.suffix.lower() == ".pdf":
        yield path.name, path.read_bytes()
    else:
        raise ValueError("Forneça um PDF, ZIP de PDFs ou pasta.")


def process(path):
    results, errors = [], []
    for filename, content in iter_pdfs(path):
        try:
            results.extend(read_pdf(content, filename))
        except Exception as exc:
            errors.append(dict(arquivo=filename, erro=str(exc)))
    counts = Counter(row["matricula"] for row in results)
    for row in results:
        if counts[row["matricula"]] > 1:
            row["conferencia"] = "REVISAR_DUPLICIDADE"
    return results, errors


def write_csv(path, rows, fields):
    with path.open("w", encoding="utf-8-sig", newline="") as out:
        writer = csv.DictWriter(out, fieldnames=fields, delimiter=";")
        writer.writeheader()
        writer.writerows(rows)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("entrada", type=Path)
    parser.add_argument("--saida", type=Path, default=Path("notas-aula09.csv"))
    args = parser.parse_args()
    results, errors = process(args.entrada)
    write_csv(args.saida, results, FIELDS)
    errors_path = args.saida.with_name(args.saida.stem + "-erros.csv")
    write_csv(errors_path, errors, ["arquivo", "erro"])
    print(f"{len(results)} vínculo(s) matrícula/nota, {len(errors)} PDF(s) com erro. Duplicatas permanecem sinalizadas para revisão.")


if __name__ == "__main__":
    main()
